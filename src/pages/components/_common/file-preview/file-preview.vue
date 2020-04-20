<template>
	<transition name="fade">
		<div 
			v-if="visible" 
			:style="coordStyle" 
			class="c-preview" 
			@click="visible=false"
		>
			<i class="iconfont icon-clear"/>
			<div 
				v-if="isIframe" 
				class="_preview-wrapper _iframe-box"
				@click.stop="visible=true"
			>
				<iframe :src="data.fileUrl" frameborder="0"/>
			</div>
			<div 
				v-else 
				class="_preview-wrapper"
				@click.stop="visible=true"
			>
				<img v-if="isImg" :src="data.fileUrl" alt="">
				<video
					v-if="isVideo"
					:src="data.fileUrl"
					controls="controls"
					width="100%"
				/>
				<audio 
					v-if="isAudio"
					:src="data.fileUrl"
					controls="controls"
				/>
			</div>
		</div>
	</transition>
</template>
<script>
import { CreatePortal } from 'wya-vc';

export const supportFileType = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pdf', 'mp4', 'mp3'];

export default {
	name: 'oa-preview',
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			isIframe: false,
			isImg: false,
			isVideo: false,
			isAudio: false,
			coordStyle: {
				transformOrigin: `${this.data.x}px ${this.data.y}px 0`
			},
			otherList: ['txt', 'zip', 'rar'],
			supportFileType

		};
	},
	mounted() {
		this.initType();
	},
	methods: {
		initType() {
			let fileUrl = this.data.fileUrl;
			let fileArry = fileUrl.split('.');
			let suffix = fileArry[fileArry.length - 1].toLowerCase(); // 获取后缀
			let isVisible = this.supportFileType.includes(suffix);// 判断文件是否允许预览
			if (!isVisible) {
				this.visible = false;
				this.$Message.error(`暂不支持预览${suffix}类型的文件!`);
			} else {
				switch (suffix) {
					case 'png':
					case 'jpg':
					case 'jpeg':
					case 'bmp':
					case 'gif':
						this.isImg = true;
						break;
					case 'doc':
					case 'docx':
					case 'xls':
					case 'xlsx':
					case 'ppt':
						this.isIframe = true;
						this.data.fileUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + fileUrl;
						break;
					case 'pdf':
						this.isIframe = true;
						break;
					case 'mp4': 
						this.isVideo = true;
						break;
					case 'mp3': 
						this.isAudio = true;
						break;
					default:
						return false;
				}
				this.visible = true;
			}
		}
	}
};
export const FilePreview = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" scoped>
.c-preview{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba($color: #000000, $alpha: 1.0);
	z-index: 100000;
	.icon-clear{
		float: right;
		margin-right: 20px;
		margin-top: 15px;
		color: #fff;
		cursor: pointer;
	}
	._preview-wrapper{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		&._iframe-box{
			width: 80%;
			height: 100%;
		}
		img{
			max-width: 100%;
			max-height: 100%;
		}
		iframe{
			height: 100%;
			width: 100%;
		}
	}
}
.fade-enter-active, .fade-leave-active{
	transition: all .3s;
}
.fade-enter, .fade-leave-to{
	transform: scale(0);
	opacity: 0;
}
</style>
 