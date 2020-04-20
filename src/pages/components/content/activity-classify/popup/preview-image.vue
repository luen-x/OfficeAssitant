<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		width="680px"
		title="查看封面"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="v-activity-clasify-preview">
			<vc-upload
				:size="4"
				accept="image/*"
				@file-start="handleFileStart"
				@file-error="handleFileError"
				@file-success="handleFileSuccess">
				<i-button type="error" ghost>更换封面图片</i-button>
			</vc-upload>
		</div>
		<div class="g-tc g-m-t-15">
			<img :src="nowImg" style="max-height: 350px; max-width: 400px">
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button } from 'iview';
import { CreatePortal, Upload } from 'wya-vc';
import API from '@stores/apis/root';

export default {
	name: "vc-tpl-basic",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'vc-upload': Upload
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			defaultList: {},
			nowImg: '',
		};
	},
	computed: {
		
	},
	created() {
		this.nowImg = this.data.image_url;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$request({
				url: API._CONTENT_ACTIVITY_CLASSIFY_UPDATE_IMAGE_POST,
				type: "POST",
				param: {
					id: this.data.category_id,
					image: this.nowImg
				}
			}).then(res => {
				this.data.image_url = this.nowImg;
				this.$Message.success(res.msg);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleFileStart(file) {
		},
		handleFileSuccess(res, file) {
			this.nowImg = res.data.url;
		},
		handleFileError(res, file) {
			this.$Message(res.msg);
		},
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>



