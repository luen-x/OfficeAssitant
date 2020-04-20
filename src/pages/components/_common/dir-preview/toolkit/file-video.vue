<template>
	<div class="v-sale-file-content g-flex g-jc-c g-ai-c">
		<div 
			v-if="fileUrl" 
			class="g-flex"
			style="max-width: 100%;max-height: 100%;"
		>
			<video 
				:src="fileUrl" 
				class="g-col"
				width="100%"
				controls="controls"
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
