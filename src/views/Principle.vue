<script setup></script>
<template>
	<main>
		<div
			class="px-4 py-6 mt-10 sm:px-0 sm:mt-12 sm:px-6 md:mt-16"
		>
			<div class="sm:text-center lg:text-left flex flex-col">
				<img src="/img/sample.png" alt="範例證書" class="self-center w-96 border shadow-2xl mb-16"/>
				<p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
					利用 RSA 及 JWT 技術，簽發單位簽發時利用私鑰將證書私訊簽名，簽發之證書將附上一個 QR Code，內含簽發之 JWT，掃描 QR Code 後，本平台將利用公鑰驗證證書之真實性。
				</p>
			</div>
		</div>
	</main>
</template>
