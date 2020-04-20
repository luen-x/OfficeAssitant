<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-material-application-reject"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>驳回申请</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="驳回原因：" prop="audit_remark">
				<oa-limit-words 
					v-model="formData.audit_remark"
					placeholder="请填写驳回原因"
					clearable
					style="width: 80%"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import LimitWords from '@components/_common/limit-words/limit-words';
import { CreatePortal } from 'wya-vc';

export default {
	name: "oa-material-application-edit",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords,
	},
	props: {
		applyId: [String, Number]
	},
	data() {
		return {
			visible: false,
			formData: {// 表单
				audit_remark: ''
			},
			rules: {// 表单验证
				audit_remark: [
					{ required: true, message: '请填写驳回原因', trigger: 'blur' }
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
					this.$request({
						url: '_SALE_LIBRARY_APPLY_AUDIT_POST',
						type: "POST",
						loading: false,
						param: {
							apply_id: this.applyId,
							audit_remark: this.formData.audit_remark,
							status: 3
						},
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
		}
	}
};

export const FractionMaterialApplicationReject = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-material-application-reject {
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

