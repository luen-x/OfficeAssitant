<template>
	<div class=" v-sale-study-video-preview-adjunct  ">
		<div class="_file-content" style="width:100%">
			<iframe
				v-if="isHtml"
				:src="urlAdress"
				frameborder="0"
				width="100%"
				height="100%"/>
			<div v-if="isVideo" style=" height: 100%; ">
				<!-- <video
					:src="urlAdress"
					controls="controls"
					controlslist="nodownload"
					width="100%"
				/> -->
				<oa-video
					v-if="isVideo"
					:method="method"
					:video_method="video_method"
					:is-video="isVideo"
					:file-url="hrefUrl"/>
			</div>
			<div
				v-if="isAudio"
				style=" height: 100%; display: flex;background: #000;  align-items: center; ">

				<oa-audio v-if="isAudio" :src="urlAdress" style="background: #fff;" class="_audioplayer"/>
			</div>
			<!-- <audio
				v-if="isAudio"
				:src="urlAdress"
				class="_audioplayer"
				controlslist="nodownload"
				controls="controls"
			/> -->
			<div
				v-if="isImg||isBig||(isPreview&&hrefUrl)|| !hrefUrl"
				class="g-flex-cc g-flex-ac"
				style="background:#000;color:#fff;height: 100%;width:100%">
				<img
					v-if="isImg"
					:src="urlAdress"
					class="_img"
					alt
					style="max-height: 83vh;">
				<div v-if="isBig" class="_big-content">目前暂不支持预览大于等于10M的doc文件</div>
				<div v-if="isPreview&&hrefUrl" class="_big-content">
					<span v-if="isDownload">
						暂无法在线观看，请先<span class="g-operation" style="font-size:18px !important" @click="handleDownload(file)">下载</span>后查看
					</span>
					<span v-else>
						暂无可下载文件，详细请咨询三立学府
						<!-- 您还没有查看权限，请<span class="g-operation" @click="handleApply">点击这里</span>去素材库进行申请 -->
					</span>
				</div>
				<div v-if="!hrefUrl" class="_big-content">
					请选择文件查看
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { Modal, Drawer } from 'iview';
import { OSS_SEARCH_CUSTOMER } from "@constants/constants";
import { downloadFile } from '@utils/download';
import audio from './audio';
import video from './video';


export default {
	name: 'oa-preview',
	components: {
		'oa-video': video,
		'oa-audio': audio
	},
	props: {

	},
	data() {
		return {
			file: {},
			hrefUrl: '',
			fileType: String,
			fileName: String,
			fileSize: String,
			closable: false,
			isHtml: false,
			isVideo: false,
			isAudio: false,
			isImg: false,
			isBig: false,
			isPreview: false,
			urlAdress: '',
			isDownload: '0',
			video_method: '',
			method: ""
		};
	},
	watch: {
		hrefUrl(res) {
			this.urlAdress = res;
			this.handleFileUrl();
		}
	},
	created() {
		this.$vc.on('PREVIEW_FILE', (data) => {
			if (this.hrefUrl == data.attachment_url) return;
			this.isPreview = false;
			this.isHtml = false;
			this.isVideo = false;
			this.isAudio = false;
			this.isImg = false;
			this.isBig = false;
			this.file = data;
			this.video_method = data.video_method;
			this.method = data.method;
			this.hrefUrl = data.attachment_url;
			this.isDownload = data.is_download;
			if (!data.attachment_url) { return; }
			let type = data.attachment_url.split('.');
			let fileType = type[type.length - 1].toLowerCase();
			if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif' || fileType === 'jpeg') {
				this.fileType = 'img';
			} else {
				this.fileType = fileType;
			}
			this.fileName = data.attachment_url;
			this.fileSize = data.file_size;
		});
	},
	mounted() {
		this.handleFileUrl();
		this.closable = true;
	},
	beforeDestroy() {
		this.$vc.off('PREVIEW_FILE');
	},
	methods: {
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleDownload(file) {
			if (file.attachment_type == 2 && file.children.length > 0) {
				file.children.forEach(ele => {
					this.handleDownload(ele);
				});
			} else {
				downloadFile({ fileName: file.attachment_url });
			}
		},
		handleApply() {
			this.$router.push({ path: '/sale/fraction/material/bank' });
		},
		handleFileUrl() {
			this.isPreview = false;
			switch (this.fileType) {
				case 'doc':
				case 'docx':
				case 'ppt':
				case 'pptx':
				case 'xls':
				case 'xlsx':
					this.urlAdress = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.hrefUrl;
					this.isHtml = true;
					this.closable = true;
					if (this.fileSize.indexOf('M') !== -1) {
						if (+this.fileSize.split('M')[0] >= 10) {
							this.urlAdress = OSS_SEARCH_CUSTOMER;
							this.isImg = true;
							this.isAudio = false;
							this.isHtml = false;
							this.isVideo = false;
							this.isBig = true;
						}
					} else {
						this.isBig = false;
					}
					break;
				case 'pdf':
					this.urlAdress = this.hrefUrl;
					this.isHtml = true;
					this.isImg = false;
					this.isAudio = false;
					this.isVideo = false;
					this.closable = true;
					this.isBig = false;
					break;
				case 'img':
					this.urlAdress = this.hrefUrl;
					this.isImg = true;
					this.isHtml = false;
					this.isVideo = false;
					this.closable = true;
					this.isBig = false;
					break;
				case 'mp4':
					this.urlAdress = this.hrefUrl;
					this.isVideo = true;
					this.isAudio = false;
					this.isHtml = false;
					this.isImg = false;
					this.closable = true;
					this.isBig = false;
					break;
				case 'mp3':
					this.urlAdress = this.hrefUrl;
					this.isVideo = false;
					this.isHtml = false;
					this.isImg = false;
					this.isAudio = true;
					this.closable = true;
					this.isBig = false;
					break;
				default:
					this.isPreview = true;
					return false;
			}
		}
	}
};
</script>
<style lang="scss">
.v-sale-study-video-preview-adjunct {
	display: flex;
	width: 100%;
	height: 100%;
	z-index: 100;
	background: #fff;
	.vertical-center-modal {
		display: flex;
		align-items: center;
		justify-content: center;
		.ivu-modal {
			top: 0;
			right: 0;
		}
	}
	._file-content {
		position: relative;
		height: 100%;
		width: 100%;
		overflow: auto;
		._audioplayer {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		._img {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			max-height: 80vh;
		}
		._big-content {
			position: absolute;
			width: 100%;
			text-align: center;
			top: 65%;
			transform: translateY(-50%);
			font-size: 18px;
		}
	}
}
</style>
