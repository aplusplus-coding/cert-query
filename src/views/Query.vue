<script setup>
import * as jose from 'jose'
import {useRoute} from 'vue-router'
import {reactive, ref} from "vue";
import {VuePdf} from "vue3-pdfjs";

const router = useRoute()
let loading = ref(true)
let isValid = ref(true), payload = ref({}), protectedHeader, errorMessage = ref("");
const pubkey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2OPGiOs3SBU/ruM4lnzd
X7bakb0woHLBRdb/o6YCb+0m1413dWEd1TSmAJ1uD8EQqYH+4wEe1SkKVD4HIm4i
/AQiTKRafVbRibxcYMZppQzJld9xyIZ40UZbmwkN52ruCP0lsvVIPF+orG0sQxRi
5llQUH3lkKm1KDiRCnfyH5kcOdh5d6zyPQcLDGkmOlh11nHPxWSG7IQRK7hakFYR
C3d4qnOhs77m+hs4FhZzDRWIBnkvtOx0OAcDHLJzZ9btOnP3NBQSGbXYjJAqJq43
3AbKiM+eGI801I4FoFqWBV67mBv0TpjIeN1bT/BIpNMvL91PLeOb/3inXnmABYZp
TwIDAQAB
-----END PUBLIC KEY-----`

if (router.query.key === undefined) {
    if (router.query.certificate_number && router.query.secret) {
        fetch("https://lms-api.nthu.dev/api/certificate/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                certificate_number: router.query.certificate_number,
                secret: router.query.secret
            })
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                pdf_file.value = data.file
                payload.value = {
                    jti: data.certificate_number,
                    sub: data.certificate_type,
                    iss: data.issuer.name,
                    iss_logo: data.issuer.logo,
                    iat: data.issued_at,
                    nbf: data.not_before,
                    exp: data.expires_at,
                    owner: data.owner,
                    file: data.file,
                    name: data.name,
                    description: data.description,
                }
                loading.value = false
                isValid.value = true
            } else {
                errorMessage.value = "查無此證書"
                isValid.value = false
            }
        })
    }
} else {
    loading.value = false

    try {
        const data = await jose.compactVerify(router.query.key, await jose.importSPKI(pubkey, "RS256"))
        payload.value = JSON.parse(new TextDecoder().decode(data.payload))
        protectedHeader = data.protectedHeader
    } catch (e) {
        console.log(e)
        errorMessage.value = e.message
        isValid.value = false
    }
}

</script>
<template>
    <main>
        <div
            class="px-4 py-6 mt-10 sm:px-0 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
        >
            <template v-if="loading">
                <div class="text-3xl">🔄 載入中</div>
            </template>
            <template v-else>
                <template v-if="isValid">
                    <div class="text-3xl">✅ 驗證成功 <span class="font-bold">{{ payload.jti }}</span></div>
                    <p
                        class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        證書類別： <span class="font-bold">{{ payload.sub }}</span>
                    </p>
                    <p
                        class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        證書內容： <span class="font-bold">{{ payload.name }}</span>
                    </p>
                    <p
                        class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        證書說明： <span class="font-bold">{{ payload.description }}</span>
                    </p>
                    <p
                        class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        簽發者： <span class="font-bold">{{ payload.iss }}</span> <img v-if="payload.iss_logo"
                                                                                      :src="payload.iss_logo" alt="Logo"
                                                                                      class="w-8 h-8 inline-block"/>
                    </p>
                    <p
                        class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        簽發時間： {{ new Date(payload.iat).toLocaleString() }}
                    </p>
                    <p
                        class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        生效日期： {{ new Date(payload.nbf).toLocaleString() }}
                    </p>
                    <p
                        class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        有效日期： {{ new Date(payload.exp).toLocaleString() }}
                    </p>
                    <p
                        class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        擁有者： <span class="font-bold">{{ payload.owner }} {{ payload.aud }}</span>
                    </p>
                    <p
                        class="mt-3 text-lg text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        <span class="font-bold">{{ payload.title }}</span>
                    </p>
                    <p
                        class="mt-3 text-base text-gray-800  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        {{ payload.body }}
                    </p>
                    <object v-if="payload.file" :data="payload.file" type="application/pdf"
                            class="mt-5 w-full h-full min-h-screen"></object>
                </template>
                <template v-else>
                    <div class="text-3xl">❌ 驗證失敗</div>
                    <div class="text-sm text-gray-400 mt-3">{{ errorMessage }}</div>
                </template>
            </template>
        </div>
    </main>
</template>
