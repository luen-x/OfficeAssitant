<template>
	<i-drawer
		ref="folder"
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		:title="fileName"
		class-name="v-sale-config-preview-adjunct"
		@on-close="handleCancel"
	>
		<div slot="header" class="_header g-fs-16">
			{{ fileName?fileName:"请选择文件" }}
			<i
				v-if="1||data.role"
				style="font-size:16px"
				class="g-m-l-10 g-operation iconfont icon-download1"
				@click="handleDownload()"
			/>
		</div>
		<oa-tree
			v-if="type&&folder_api"
			:material_id="data.material_id"
			:folder_api="folder_api"
			style="width:360px;height: 100%;overflow-y: auto;"
			@check="handleLook"
		/>
		<div :style="{borderLeft:data.type==1?'none':':1px solid #bfbfbf;'}" class="oa-preview">
			<div class="_file-content">
				<iframe
					v-if="isHtml"
					:src="urlAdress"
					frameborder="0"
					width="100%"
					height="100%"/>
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
				<div v-if="!hrefUrl||isError" class="_big-content">此格式的文件目前暂不支持预览</div>
				<div v-if="isBig" class="_big-content">目前暂不支持预览大于等于10M的doc文件</div>
			</div>
		</div>
	</i-drawer>
</template>
<script>
import { Modal, Drawer } from 'iview';
import { CreatePortal } from 'wya-vc';
import { downloadFile } from '@utils/download';
import { OSS_SEARCH_CUSTOMER } from "@constants/constants";
import Tree from './tree';

export default {
	name: 'oa-preview-folder',
	components: {
		'i-modal': Modal,
		"i-drawer": Drawer,
		"oa-tree": Tree,
	},
	props: {
		data: {
			type: Object,
			default() {
				return {
					material_id: '',
					type: '',
					hrefUrl: '',
					fileType: '',
					fileSize: '',
					fileName: '',
					role: "",

				};
			}
		},
		folder_api: {
			type: [String],
			default: ''
		}
	},
	data() {
		return {
			type: this.data.type != 1,
			hrefUrl: '',
			fileType: '',
			fileName: '',
			fileSize: '',
			closable: false,
			isHtml: false,
			isVideo: false,
			isAudio: false,
			isImg: false,
			isBig: false,
			isError: '',
			urlAdress: '',
			material_id: '',
		};
	},
	watch: {
		'data.material_id': function (v) {
			this.fileName = this.data.fileName;
			if (this.data.type == 1) {
				this.type = false;
				this.handleLook(this.data);
			} else {
				this.type = true;
				this.handleRest();
				this.handleLook({
					hrefUrl: '',
					fileType: '',
					fileSize: '',
					fileName: this.data.fileName,
				});
			}

		}
	},
	mounted() {
		this.closable = true;
		this.handleFileUrl();
		if (this.data.type == 1) this.handleLook(this.data);
		this.fileName = this.data.fileName;
	},
	methods: {
		handleLook(res) {
			this.hrefUrl = res.hrefUrl || '';
			this.fileType = res.fileType || '';
			this.fileName = res.fileName || '';
			this.fileSize = res.fileSize || '';
			this.material_id = res.material_id || '';
			this.handleRest();
			this.handleFileUrl();
			this.closable = true;
		},
		handleRest() {
			this.isError = false;
			this.isHtml = false;
			this.isVideo = false;
			this.isAudio = false;
			this.isImg = false;
			this.isBig = false;
			this.urlAdress = "";
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleFileUrl() {
			this.fileType = this.fileType.toLowerCase();
			this.isError = false;
			if (!this.fileType) return false;
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
					this.fileSize = this.fileSize + '';
					if (this.fileSize && this.fileSize.indexOf('M') !== -1) {
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
				case 'png':
				case 'gif':
				case 'img':
				case 'jpg':
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
					this.isImg = true;
					this.urlAdress = OSS_SEARCH_CUSTOMER;
					this.isError = true;
					this.isHtml = false;
					this.isVideo = false;
					this.isBig = false;
					return false;
			}
		},
		downloadCreate(material_id) {
			this.$request({
				url: '_SALE_LIBRARY_DOWNLOAD_CREATE_POST',
				type: 'post',
				param: {
					type: 3,
					material_ids: [material_id]
				},
			}).then((data) => {});
		},
		handleDownload() {
			if (!this.hrefUrl) {
				this.$Message.info('请先选择文件');
				return;
			}
			downloadFile({ fileName: this.hrefUrl }).then((res) => {
				// this.downloadCreate(this.material_id || this.data.material_id);
			}).catch((err) => {
				console.error(err, 333);
			});
		}
	}
};
export const PreviewFolder = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss">
    .v-sale-config-preview-adjunct {
        .vertical-center-modal {
            .ivu-modal {
                top: 0;
                right: 0;
            }
        }
        ._header {
			color: #000;
            font-weight: bold;
            padding: 0 12px;
            height: 40px;
            line-height: 40px;
            background: rgba(240, 244, 252, 1);
        }
        .ivu-drawer-header {
            padding: 14px 0  0 0 !important;
            border: none !important;
        }
        .ivu-drawer-close {
            top: 18px !important;
        }
        .ivu-drawer-body {
            display: flex;
			padding-top:0;
        }
        .oa-preview {
			border-left:1px solid #bfbfbf;
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
