<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="设置头像"
		width="400px"
		class="v-hr-details-change-avatar-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<vc-upload
			:size="20"
			:max="1"
			accept=".png, .jpg, .jpeg, .gif"
			@begin="handleBegin"
			@file-before="handleFileStart"
			@file-error="handleFileError"
			@complete="handleComplete"
			@file-success="handleFileSuccess">
			<i-button type="error" ghost>点击选择照片</i-button>
		</vc-upload>
		<div v-if="fileSize < 20480000 &&!!fileSize" class="g-m-t-20">
			<vc-imgs-crop 
				ref="target"
				:src="imgOri" 
				:scale="scale" 
				:rotate="rotate" 
				:border-radius="110"
				cross-origin="anonymous"
			/>
			<i-slider 
				:min="0.3" 
				:max="3" 
				:step="0.01" 
				v-model="scale" 
				@onChange="handleScale" 
			/>
			<i-slider 
				:min="0" 
				:max="360" 
				v-model="rotate" 
				@onChange="handleRotate"
			/>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Slider } from "iview";
import { CreatePortal, ImgsCrop, Upload } from "wya-vc";
import { getItem, setItem, delItem, getHashUrl, getParseUrl, unCode } from '@utils/utils';
import API_ROOT from "@stores/apis/root";

export default {
	name: "vc-hr-summary-details-avatar-modal",
	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-slider": Slider,
		'vc-upload': Upload,
		'vc-imgs-crop': ImgsCrop,
	},
	data() {
		return {
			fileSize: '',
			goUpload: null,
			visible: false,
			title: '',
			scale: 1,
			rotate: 0,
			img: '',
			src: '',
			imgOri: '',
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.handleSave();
		},
		handleBegin(files) {
			if (files[0].size > 20480000) {
				this.$Message.error('图片不要超过20MB');
				this.fileSize = files[0].size;
				return; 
			}
			this.fileSize = files[0].size;
		},
		handleFileStart(e, file) {
			this.reader = new FileReader();
			let self = this;
			this.reader.onload = () => {
				self.imgOri = this.reader.result; // 原图的base64
			};
			this.reader.readAsDataURL(e);
			return new Promise((resolve, reject) => {
				this.goUpload = resolve;
			});
		},
		handleComplete(info = {}) {
			this.fetchAvatar(info.imgs[0].data.url);
		},
		handleFileSuccess(res, file) {
		},
		handleFileError(res, file) {
		},
		handleCancel() {
			this.$emit("close");
		},
		handleScale(scale) {
			this.scale = scale;
		},
		handleRotate(rotate) {
			this.rotate = rotate;
		},
		fetchAvatar(head_img) {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_AVATAR_INFO_POST,
				type: "POST",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					head_img
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
				this.visible = false;
			}).catch(err => {
				this.$refs.modal.buttonLoading = false;
			});
		},
		async handleSave() {
			if (this.fileSize > 20480000) {
				this.$Message.error('图片不要超过20MB');
				this.$refs.modal.buttonLoading = false;
				return false;
			}
			try {
				const { file, base64Image } = await this.$refs.target.getImage(true, "image", true);
				this.imgOri = base64Image;
				this.goUpload && this.goUpload(file);
				this.fetchAvatar();
			} catch (e) {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('图片上传有误，请重新上传');
			}
		},
	}
};

export const AvatarModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>