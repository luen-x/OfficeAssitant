<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		:title="fileName"
		class-name="v-sale-content-tookit-manage-Preview-adjunct"
		@on-close="handleCancel"
	>
		<div slot="header" class="_header g-fs-16">{{ fileName }}</div>
		<div class="oa-preview">
			<div class="_file-content">
				<iframe
					v-if="isHtml"
					:src="urlAdress"
					frameborder="0"
					width="100%"
					height="97%"/>
				<div v-if="isVideo" class="g-flex" style="align-items: center; height: 100%;">
					<video
						:src="urlAdress"
						controls="controls"
						controlslist="nodownload"
						width="100%"
					/>
				</div>
				<audio
					v-if="isAudio"
					:src="urlAdress"
					class="_audioplayer"
					controlslist="nodownload"
					controls="controls"
				/>
				<img v-if="isImg" :src="urlAdress" class="_img" alt>
				<div v-if="isBig" class="_big-content">目前暂不支持预览大于等于10M的doc文件</div>
			</div>
		</div>
	</i-drawer>
</template>
<script>
import { Modal, Drawer } from 'iview';
import { CreatePortal } from 'wya-vc';
import { OSS_SEARCH_CUSTOMER } from "@constants/constants";

export default {
	name: 'oa-preview',
	components: {
		'i-modal': Modal,
		"i-drawer": Drawer
	},
	props: {
		hrefUrl: String,
		fileType: String,
		fileName: String,
		fileSize: String
	},
	data() {
		return {
			closable: false,
			isHtml: false,
			isVideo: false,
			isAudio: false,
			isImg: false,
			isBig: false,
			urlAdress: ''
		};
	},
	watch: {
		hrefUrl(res) {
			this.urlAdress = res;
			this.handleFileUrl();
		}
	},
	mounted() {
		this.handleFileUrl();
	},
	methods: {
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleFileUrl() {
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
					this.$Message.error('这不是一个有效的文件');
					return false;
			}
		}
	}
};
export const PreviewAdjunct = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss" >
    .v-sale-content-tookit-manage-Preview-adjunct {
        ._header {
            color: #000;
            font-weight: bold;
            padding: 0 12px;
            height: 40px;
            line-height: 40px;
            background: rgba(240, 244, 252, 1);
        }
        .ivu-drawer-header {
            padding: 14px 0 0 0 !important;
            border: none !important;
        }
        .ivu-drawer-close {
            top: 18px !important;
        }
        .vertical-center-modal {
            display: flex;
            align-items: center;
            justify-content: center;
            .ivu-modal {
                top: 0;
                right: 0;
            }
        }
        .oa-preview {
            width: 100%;
            height: 100%;
            z-index: 100;
            background: #fff;
            ._file-content {
                position: relative;
                height: 100%;
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
                    max-width: 100%;
                    max-height: 100%;
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
    }
</style>
