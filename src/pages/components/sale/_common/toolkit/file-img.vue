<template>
	<div class="v-sale-file-content">
		<div v-if="fileUrl" class="g-pd-lr-10 g-flex g-jc-c g-ai-c _box">
			<oa-lazy-load
				:file-url="fileUrl" 
				:img-data="imgData"
				style="height:100%;"
				class="g-flex g-jc-c g-ai-c"
			/>
		</div>
	</div>
</template>

<script>
import LazyLoad from '@components/_common/lazy-load/lazy-load';

export default {
	name: 'oa-file-img',
	components: {
		'oa-lazy-load': LazyLoad
	},
	props: {
		fileUrl: String,
		imgData: {
			type: Array,
			default: () => ([])
		}
	}
};

export const FileImg = module.exports.default;
</script>

<style lang="scss">
.v-sale-file-content {
	width: 100%;
	padding: 0 20px;
	height: calc(100% - 86px);
	._box {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	.vc-imgs-preview .__mask {
		background: rgba($color: #fff, $alpha: 0);
	}
	img {
		max-width: 100%;
		max-height: 100%;
	}
}
</style>
