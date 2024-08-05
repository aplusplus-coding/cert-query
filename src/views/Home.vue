<script setup>
import {ref} from "vue";
import {StreamBarcodeReader} from "vue-barcode-reader";

const decodedText = ref("");
const show = ref(false);
const onDecode = (text) => {
    decodedText.value = text;
    if (text) {
        if (text.startsWith("http")) {
            window.open(text, "_blank");
        } else {
            const type = text[0];
            const lang_type = {
                "1": "獎狀"
            }
            alert("您掃描的證書類型為：" + lang_type[type]);
            const code_letter = String.fromCharCode(String(text.slice(1, 4))) + String(text.slice(4, 7));
            const code_number = text.slice(7, 13);
            alert("您掃描的證書號為：" + code_letter + code_number);
        }
    }
};

const onLoad = (code) => {
    alert("請掃描條碼或QR Code，掃描條碼時請將條碼放置於框框中，左右些微突出");
}
</script>
<template>
    <main>
        <div
            class="px-4 py-6 mt-10  sm:px-0 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
        >
            <img class="" src="/img/logo-rect.png" alt="Logo"/>
            <div class="sm:text-center lg:text-left">
                <p class="mt-3 text-base text-gray-500  sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    所有本營隊或相關合作發證組織所簽發之數位證明可於此查詢真實性。
                </p>
            </div>


            <button @click="show = !show"
                    class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                掃描條碼
            </button>

            <div v-if="show">
                <StreamBarcodeReader @decode="onDecode" @loaded="onLoad"></StreamBarcodeReader>
                <h2>{{ decodedText }}</h2>
            </div>
        </div>
    </main>
</template>
