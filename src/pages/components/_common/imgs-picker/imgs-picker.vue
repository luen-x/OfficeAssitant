<template>
	<vc-imgs-picker
		v-if="showPicker"
		ref="imgPicker"
		v-model="data"
		:disabled="disabled"
		:max="max"
		class="oa-imgs-picker"
		@change="handleChange"
		@error="handleError"
		@open="handlePreviewStart"
		@close="handlePreviewEnd"
	>
		<span slot="operate" slot-scope="{src,index}">
			<i
				v-if="!disabled"
				style="position: absolute;top: 0;right: 2px;"
				class="iconfont icon-close __close"
				@click="handleDel(src,index)"
			/>
			<i
				class="iconfont icon-preview"
				@click="handlePreview($event, index)"
			/>
			<i class="iconfont icon-vertical-line"/>
			<i
				class="iconfont icon-download"
				@click="handleDownload(src)"
			/>
		</span>
	</vc-imgs-picker>
</template>
<script>
import { ImgsPicker } from 'wya-vc';
import downloadFile from '@utils/download';

// 对imgspicker进行了一次封装，以满足定制化需求
export default {
	name: 'oa-imgs-picker',
	components: {
		'vc-imgs-picker': ImgsPicker
	},
	model: {
		prop: 'dataSource',
		event: 'change'
	},
	props: {
		dataSource: Array,
		disabled: Boolean,
		max: Number,
		reactive: Boolean
	},
	data() {
		return {
			showPicker: true,
			data: [...this.dataSource]
		};
	},
	watch: {
		dataSource(newVal, old) {
			if (this.reactive) {
				if (newVal.find(i => i.uid)) return;
				if (!((newVal.length == old.length) && newVal.every((item, index) => item === this.data[index]))) {
					this.data = [...newVal];
					this.updateShowPicker();
				}
			} else {
				this.data = [...newVal];

			}
		}
	},
	methods: { 
		updateShowPicker() {
			this.showPicker = false;
			this.$nextTick(() => {
				this.showPicker = true;
			});
		},
		handleDel(item, index) {
			this.$refs.imgPicker.handleDel(item, index);

		},
		handlePreview(event, index) {
			this.$refs.imgPicker.handlePreview(event, index);
		},
		handleDownload(url) {
			if (url.includes('aliyuncs')) {
				downloadFile({
					fileName: url
				});
			} else {
				this.$Message.error('仅支持下载上传到阿里云的图片');
			}
		},
		handleChange(event) {
			this.$emit('change', event);
		},
		handleError(err) {
			this.$emit('error', err);
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		},

	}
};
</script>
<style lang="scss">

</style>