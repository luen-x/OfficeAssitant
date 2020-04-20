<template>
	<div class="v-file-content g-pd-lr-10 g-tc">
		<oa-lazy-load 
			:file-url="file_url" 
			:img-data="[file_url]"
			style="height:100%;"
			class="g-flex g-jc-c g-ai-c"
		/>
	</div>
</template>

<script>
import LazyLoad from '@components/_common/lazy-load/lazy-load';
import { ImgsPreview } from 'wya-vc';

export default {
	name: 'oa-file-img',
	components: {
		'oa-lazy-load': LazyLoad,
		'vc-imgs-preview': ImgsPreview,
	},
	props: {
		file_url: String,
		imgData: {
			type: Array,
			default: () => ([])
		}
	},
};

export const FileImg = module.exports.default;
</script>

<style lang="scss" scoped>
.v-file-content {
	width: 100%;
	height: calc(100% - 86px);
	._box {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	/deep/ .vc-imgs-preview .__mask {
		background: rgba($color: #fff, $alpha: 0);
	}
}
/deep/ img {
	max-width: 100%;
	max-height: 100%;
}
</style>
