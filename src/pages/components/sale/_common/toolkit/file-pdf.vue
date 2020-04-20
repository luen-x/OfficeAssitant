<template>
	<div class="v-sale-file-content">
		<iframe 
			:src="fileUrl" 
			scrolling="auto" 
			width="100%" 
			height="100%"
		/>
	</div>
</template>

<script>

export default {
	name: 'oa-file-pdf',
	props: {
		fileUrl: String
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {},
};

export const FilePdf = module.exports.default;
</script>

<style lang="scss">
.v-sale-file-content {
	width: 100%;
	height: 100%;
	overflow-y: hidden;
}
</style>
