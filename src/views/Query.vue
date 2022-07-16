<script setup>
import * as jose from 'jose'
import {useRoute} from 'vue-router'
import {CheckCircleIcon} from '@heroicons/vue/outline';
const router = useRoute()
let isValid = true, payload, protectedHeader;
const pubkey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2OPGiOs3SBU/ruM4lnzd
X7bakb0woHLBRdb/o6YCb+0m1413dWEd1TSmAJ1uD8EQqYH+4wEe1SkKVD4HIm4i
/AQiTKRafVbRibxcYMZppQzJld9xyIZ40UZbmwkN52ruCP0lsvVIPF+orG0sQxRi
5llQUH3lkKm1KDiRCnfyH5kcOdh5d6zyPQcLDGkmOlh11nHPxWSG7IQRK7hakFYR
C3d4qnOhs77m+hs4FhZzDRWIBnkvtOx0OAcDHLJzZ9btOnP3NBQSGbXYjJAqJq43
3AbKiM+eGI801I4FoFqWBV67mBv0TpjIeN1bT/BIpNMvL91PLeOb/3inXnmABYZp
TwIDAQAB
-----END PUBLIC KEY-----`

try {
	const data = await jose.compactVerify(router.query.key, await jose.importSPKI(pubkey, "RS256"))
	payload = JSON.parse(new TextDecoder().decode(data.payload))
	protectedHeader = data.protectedHeader
} catch (e) {
	console.log(e)
	isValid = false
}
</script>
<template>
	<main>
		<div
			class="px-4 py-6 mt-10 sm:px-0 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
		>
			<div class="text-3xl" v-if="isValid">✅ 驗證成功 <span class="font-bold">{{ payload.jti }}</span></div>
			<div class="text-3xl" v-else>❌ 驗證失敗</div>
			<p
				class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
			>
				簽發者： <span class="font-bold">{{ payload.iss }}</span>({{ new Date(payload.iat).toLocaleString() }})
			</p>
			<p
				class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
			>
				擁有者： <span class="font-bold">{{ payload.owner }}</span>
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
		</div>
	</main>
</template>