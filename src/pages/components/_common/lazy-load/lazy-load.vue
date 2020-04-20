<template>
	<div class="c-lazy-load g-relative">
		<oa-loading v-show="!isLoaded" />
		<img 
			v-show="isLoaded" 
			:src="fileUrl" 
			class="g-pointer"
			@load="handleLoad"
			@click="handlePreview"
		>
	</div>
</template>

<script>
import { ImgsPreview } from 'wya-vc';
import Loading from '../loading/loading';

export default {
	name: 'c-lazy-load',
	components: {
		'oa-loading': Loading,
		'vc-imgs-preview': ImgsPreview,
	},
	props: {
		fileUrl: String,
		imgData: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			isLoaded: false
		};
	},
	methods: {
		handleLoad() {
			this.isLoaded = true;
		},
		handlePreview(e) {
			let pos = {};
			try {
				const target = e.target; // 先得到pos, 否则getThumbBoundsFn再计划，target已变化
				const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
				const rect = target.getBoundingClientRect();

				pos = { x: rect.left, y: rect.top + pageYScroll, w: rect.width };

			} catch (err) {
				console.error(err);
			}

			ImgsPreview.popup({
				visible: true,
				dataSource: this.imgData,
				opts: {
					index: this.imgData.indexOf(this.fileUrl),
					history: false,
					getThumbBoundsFn: (index) => pos
				}
			}).catch(error => {});
		}
	},
};
</script>

<style lang="scss">
</style>
