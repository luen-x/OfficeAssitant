<template>
	<div class="v-sale-file-content g-flex g-jc-c g-ai-c">
		<div 
			v-if="fileUrl" 
			class="g-pd-20"
			style="width: 100%;height: 100%;"
		>
			<video 
				v-if="fileUrl.indexOf('.mp4') > -1
				|| fileUrl.indexOf('.avi') > -1"
				:src="fileUrl" 
				class="_video"
				controls="controls"
				style="width: 100%;height: 100%;"
			/>
			<oa-file-fail 
				v-else
				:file-type="4"
				:file-url="fileUrl"
			/>
		</div>
	</div>
</template>

<script>
import { FileFail } from './file-fail';

export default {
	name: 'oa-file-video',
	components: {
		'oa-file-fail': FileFail
	},
	props: {
		fileUrl: String
	}
};

export const FileVideo = module.exports.default;
</script>

<style lang="scss">
.v-sale-file-content {
	width: 100%;
	height: calc(100% - 86px);
	padding: 0 20px;
}
</style>
