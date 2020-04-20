<template>
	<div class="v-file-content">
		<iframe 
			:src="file_url" 
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
		file_url: String
	},
	data() {
		return {
			
		};
	},
	mounted() {
		
	},
	methods: {
		
	},
};

export const FilePdf = module.exports.default;
</script>

<style lang="scss" scoped>
	.v-file-content {
		position: fixed;
		height: 100%;
		width: 100%;
	}
</style>
