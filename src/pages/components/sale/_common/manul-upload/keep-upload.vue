<template>
	<div class="v-sale-keep-upload g-relative" @click="handleClick">
		<slot/>
		<input
			ref="input"
			v-bind="inputOption"
			:webkitdirectory="directory"
			:accept="accept"
			:multiple="multiple"
			style="display:none"
			type="file"
			@change="handleChange"
		>
	</div>
</template>
<script>
import { uid } from '@utils/utils';
import { postFile } from './postFile';
import { UploadProgress } from './popup/progress';

const emptyFunc = () => {};

export default {
	name: 'oa-sale-manul-upload',
	components: {
	},
	props: {
		inputOption: { // 直接用于input的属性
			type: Object,
			default: () => ({})
		},
		accept: String,
		maxLength: {
			type: [String, Number],
			default: ''
		},
		beforeUpload: Function, // 上传前执行，返回primise resolve 对象
		directory: { // 是否选择文件夹
			type: Boolean,
			default() {
				return false;
			}
		},
		multiple: { // 是否支持多文件上传
			type: Boolean,
			default() {
				return false;
			}
		},
		allSuccess: { // 全部上传成功时回调
			type: Function,
			default: emptyFunc
		},
		oneSuccess: { // 单个文件上传成功时的回调
			type: Function,
			default: emptyFunc
		},
		progress: { // 单个文件上传进度回调
			type: Function,
			default: emptyFunc

		},
		error: { // 上传失败回调
			type: Function,
			default: emptyFunc
		},
		autoProgress: { // 是否使用默认的进度展示
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
		};
	},
	methods: {
		async handleChange(e) {
			const files = Array.prototype.slice.call(e.target.files);
			const IMAGE_LEGAL_REGEX = /[@#￥%&+ ]/;
			const FILE_LEGAL_REGEX = /[@#￥%&+]/;
			e.target.value = '';
			if (this.directory && files.length) { // 解决safari浏览器选择文件夹和文件的问题
				const hasFile = files.find(file => !file.webkitRelativePath); // 文件夹会有webkitRelativePath
				if (hasFile) {
					this.$Message.error('请选择文件夹');
					return;
				}
				if (this.maxLength && files.length > this.maxLength) {
					this.$Message.error(`文件个数最多不可以超过${this.maxLength}个`);
					return;
				}
				// const errorFiles = files.find(file => {
				// 	let regex = file.type.indexOf('image') > -1 ? IMAGE_LEGAL_REGEX : FILE_LEGAL_REGEX;
				// 	return regex.test(file.name);
				// });
				// if (errorFiles) {
				// 	this.$Message.error('文件名称不合法, 不能包含@#￥%&+和空格');
				// 	return;
				// }
				const MaxSizeFiles = files.find(file => {
					return file.size > 1048576000;
				});
				if (MaxSizeFiles) {
					this.$Message.error('单个文件不能超过1个G');
					return;
				}
			}
			let cusData = {
				fileListId: uid()
			};
			this.$emit('change', files);
			if (this.beforeUpload) {
				const result = await this.beforeUpload(files);
				if (!result) return;
				cusData = { ...cusData, ...result };
			}
			let fileList = [];
			let errNumber = 0;
			files.forEach((file, index) => {
				const fileData = {
					fileId: uid(),
					name: file.name,
					size: file.size,
					webkitRelativePath: file.webkitRelativePath,
					cancel: emptyFunc
				};
				postFile(
					file,
					(progress) => {
						this.progress({ ...fileData, ...cusData, percent: progress._percent });
						this.autoProgress && app.$store.commit(
							'CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_CHANGE',
							{ ...fileData, ...cusData, percent: progress._percent }
						);
					},
					(xhr, cancel, option) => fileData.cancel = cancel,
					(checkResult) => {
						if (this.autoProgress) {
							UploadProgress.popup();
							app.$store.commit(
								'CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_CHANGE',
								{ ...fileData, ...cusData, percent: 0 }
							);
						}
					}
				).then((res) => {
					fileList.push({ ...fileData, ...cusData, ...res.data });
					this.oneSuccess({ ...fileData, ...cusData, ...res.data });
					this.autoProgress && app.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_SUCCESS', { fileId: fileData.fileId });
					if (fileList.length == files.length || fileList.length + errNumber == files.length) {
						this.allSuccess(fileList);
					}
				}).catch((error) => {
					errNumber++;
					error.msg && this.$Message.error(error.msg);
					this.autoProgress && app.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_ERROR', { fileId: fileData.fileId });
					this.error({ ...fileData, ...cusData, error });
				});
			});
		},
		handleClick() {
			this.$refs.input.click();
		}
	}
};
</script>
<style lang="scss">
.v-sale-keep-upload {
	display: inline-block;
}
</style>