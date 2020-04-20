<template>
	<div class="v-file-content">
		<video 
			:src="file_url" 
			class="_video"
			controls="controls"
		/>
	</div>
</template>

<script>

export default {
	name: 'oa-file-video',
	props: {
		file_url: String
	}
};

export const FileVideo = module.exports.default;
</script>

<style lang="scss" scoped>
	.v-file-content {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		._video {
			width: 1024px;
			height: 674px;
		}
	}
</style>
