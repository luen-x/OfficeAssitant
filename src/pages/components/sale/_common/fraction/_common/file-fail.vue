<template>
	<div class="v-sale-fail-content g-flex g-fd-c g-jc-c g-ai-c">
		<div 
			v-if="!canLook && !isEmpty" 
			class="g-flex g-fd-c g-jc-c g-ai-c _box"
		>
			<img :src="OSS_NO_MESSAGE08" alt="" class="__img">
			<div class="g-fs-18 g-m-t-10 g-flex">
				<span>您没有查看该素材的权限，请向上级或三立学府</span>
				<span 
					class="g-pointer" 
					style="color:#2397f9;"
					@click="handleMaterialApplication"
				>
					发起申请
				</span>
			</div>
		</div>
		<div v-else>
			<div 
				v-if="(fileType === 1 || !fileType) && fileUrl && isDelete !== 1 && !isFolderEmpty" 
				class="g-flex g-fd-c g-jc-c g-ai-c _box"
			>
				<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
				<div class="g-fs-18 g-m-t-10 g-flex">
					<span>目前暂不支持预览{{ fileFormat }}格式的文件，请</span>
					<span 
						class="g-pointer" 
						style="color:#2397f9;"
						@click="handleDownload"
					>
						下载
					</span>
				</div>
			</div>
			<div 
				v-else-if="fileType === 4 && fileUrl && isDelete !== 1" 
				class="g-flex g-fd-c g-jc-c g-ai-c _box"
			>
				<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
				<div class="g-fs-18 g-m-t-10 g-flex">
					<span>目前暂不支持预览{{ fileFormat }}格式的视频，请</span>
					<span 
						class="g-pointer" 
						style="color:#2397f9;"
						@click="handleDownload"
					>
						下载
					</span>
					<span>进行播放</span>
				</div>
			</div>
			<div 
				v-else-if="fileType === 5 && fileUrl && isDelete !== 1" 
				class="g-flex g-fd-c g-jc-c g-ai-c _box"
			>
				<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
				<div class="g-fs-18 g-m-t-10 g-flex">
					<span>目前暂不支持预览{{ fileFormat }}格式的音频，请</span>
					<span 
						class="g-pointer" 
						style="color:#2397f9;"
						@click="handleDownload"
					>
						下载
					</span>
					<span>进行播放</span>
				</div>
			</div>
			<div 
				v-else-if="isDelete === 1" 
				class="g-flex g-fd-c g-jc-c g-ai-c _box"
			>
				<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
				<div class="g-fs-18 g-m-t-10 g-flex">
					<span>目前暂不支持预览已删除的文件!</span>
				</div>
			</div>
			<div
				v-else-if="isEmpty" 
				class="g-flex g-fd-c g-jc-c g-ai-c _box"
			>
				<img :src="OSS_NO_MESSAGE08" alt="" class="__img">
				<div class="g-fs-18 g-m-t-10 g-flex">
					<span>抱歉，没有找到相关内容哦!</span>
				</div>
			</div>
			<div
				v-else-if="isFolderEmpty" 
				class="g-flex g-fd-c g-jc-c g-ai-c _box"
			>
				<img :src="OSS_NO_MESSAGE08" alt="" class="__img">
				<div class="g-fs-18 g-m-t-10 g-flex">
					<span>请点击文件进行查看</span>
				</div>
			</div>
			<div
				v-else-if="previewSubMenu" 
				class="g-flex g-fd-c g-jc-c g-ai-c _box"
			>
				<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
				<div class="g-fs-18 g-m-t-10 g-flex">
					<span>抱歉，文件夹无法进行预览！</span>
				</div>
			</div>
			<div 
				v-else-if="fileType === 2 && fileUrl && isDelete !== 1 && isBig" 
				class="g-flex g-fd-c g-jc-c g-ai-c _box"
			>
				<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
				<div class="g-fs-18 g-m-t-10 g-flex">
					<span>目前暂不支持预览大于等于10M的{{ fileFormat }}文件，请</span>
					<span 
						class="g-pointer" 
						style="color:#2397f9;"
						@click="handleDownload"
					>
						下载
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { getHashUrl } from '@utils/utils';
import downloadFile from '@utils/download';
import { OSS_SEARCH_CUSTOMER, OSS_NO_MESSAGE08 } from "@constants/constants";
import { FractionMaterialApplication } from "../../../fraction-material-bank/popup/material-application";

export default {
	name: 'oa-file-fail',
	props: {
		fileType: [String, Number],
		fileUrl: String,
		isDelete: [String, Number],
		isEmpty: Boolean,
		isFolderEmpty: Boolean,
		previewSubMenu: Boolean,
		materialId: [String, Number],
		isBig: Boolean,
		canLook: [String, Number],
		fileName: String
	},
	data() {
		return {
			OSS_NO_MESSAGE08,
			OSS_SEARCH_CUSTOMER
		};
	},
	computed: {
		fileFormat: {
			set(value) {
				this.fileUrl = value;
			},
			get() {
				let arr = this.fileUrl.split('.');
				const len = arr.length;
				return arr[len - 1];
			}
		}
	},
	methods: {
		/**
		 * 下载预警
		 */
		downloadWarning() {
			return this.$request({
				url: API_ROOT.TOOLKIT_DOWNLOAD_WARNING_POST,
				type: 'POST',
				loading: false,
				param: {
					material_type: 3,
					download_num: 1
				},
				autoTip: false
			}).then(res => {
				if (res.status) {
					return true;
				} else {
					return false;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
				return false;
			});
		},
		/**
		 * 文件下载
		 */
		async handleDownload() {
			if (this.$auth[524]) {
				const can_download = await this.downloadWarning();
				if (can_download) {
					downloadFile({
						fileName: this.fileUrl,
						downRecordParams: {
							type: 3,
							material_ids: [this.materialId]
						}
					});
				}
			} else {
				this.$Message.warning('您没有下载权限');
			}
		},
		/**
		 * 发起申请
		 */
		handleMaterialApplication() {
			if (this.$auth[528]) {
				FractionMaterialApplication.popup({
					title: '申请查看权限',
					materialId: this.materialId,
					fileName: this.fileName
				});
			} else {
				this.$Message.warning('您没有权限发起申请');
			}
		}
	}
};

export const FileFail = module.exports.default;
</script>

<style lang="scss">
.v-sale-fail-content {
	width: 100%;
	height: 100%;
	._box {
		height: 100%;
		.__img {
			width: 200px;
			height: 200px;
		}
	}
}
</style>
