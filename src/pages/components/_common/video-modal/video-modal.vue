<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:footer-hide="true"
		:width="720"
		class="c-video-modal"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			{{ title }}
		</div>
		<video
			:src="videoUrl[urlType]"
			:width="680"
			:height="400"
			controls
		>
			您的浏览器目前还不支持video标签，请用Chrome浏览器最新版
		</video>
	</i-modal>
</template>

<script>
import { Modal, Message } from 'iview';
import { CreatePortal } from 'wya-vc';
import { videoUrl } from './constants';

export default {
	name: 'c-video-modal',
	components: {
		'i-modal': Modal,
	},
	props: {
		title: {
			type: String,
			default: () => '视频教程'
		},
		urlType: String, // video类型
	},
	data() {
		return {
			visible: false,
			videoUrl
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
	}
};
export const VideoModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-video-modal {
	.ivu-modal-content {
		width: 720px;
	}
	.ivu-modal-body {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	video {
		background-color: #000;
	}
}
</style>