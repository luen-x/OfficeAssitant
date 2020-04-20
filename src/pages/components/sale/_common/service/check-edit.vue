<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		class="v-sale-quality-check-edit" 
		width="400"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>{{ title }}</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<div style="height:15px;"/>
			<i-form-item label="跟进备注：" prop="mark">
				<oa-limit-words 
					v-model="formData.mark"
					:max="500"
					placeholder="请输入跟进备注"
					clearable
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="上传凭证：" prop="image_url">
				<oa-upload
					v-model="formData.image_url"
					:max="6"
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-quality-check-edit",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords,
		"oa-upload": Upload,
	},
	mixins: [orderModal],
	props: {
		title: String,
		mark: String,
		fileImage: Array,
		followId: [String, Number],
		qualityRecordId: [String, Number]
	},
	data() {
		return {
			visible: false,
			formData: {// 表单
				mark: this.mark || '',
				image_url: this.fileImage || []
			},
			rules: {// 表单验证
				mark: [
					{ required: true, message: '跟进备注不能为空', trigger: 'blur' }
				],
				image_url: [
					{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					let param = {};
					if (this.followId) {
						param = {
							...this.formData,
							image_url: this.formData.image_url.map(it => it.url),
							follow_id: this.followId,
							quality_record_id: this.qualityRecordId
						};
					} else {
						param = { 
							...this.formData,
							image_url: this.formData.image_url.map(it => it.url),
							quality_record_id: this.qualityRecordId
						};
					}
					this.$request({
						url: '_SALE_SERVICE_ADD_QUALITY_FOLLOW_POST',
						type: 'POST',
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure');
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};
export const ServiceQualityCheckEdit = CreatePortal({}, module.exports.default);

</script>
<style lang="scss">
.v-sale-quality-check-edit {
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

