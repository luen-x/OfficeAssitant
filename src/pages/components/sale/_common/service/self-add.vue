<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-self-add"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			
			<span>自定义服务项</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent="handleOk"
		>
			<i-form-item label="服务项名称：" prop="custom_set_name">
				<i-input
					v-model="formData.custom_set_name" 
					:maxlength="15"
					placeholder="请输入服务项名称" 
					style="width:220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Input, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-self-add",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem
	},
	mixins: [orderModal],
	props: {
		serviceId: [String, Number],
		contractId: [String, Number],
		contractCompanyId: [String, Number]
	},
	data() {
		return {
			visible: false,
			formData: {// 表单
				custom_set_name: '',
			},
			rules: {// 表单验证
				custom_set_name: [
					{ required: true, message: '服务项名称不能为空', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close', {
				changed: false
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
						url: '_SALE_SERVICE_ADD_CUSTOM_POST',
						type: 'POST',
						loading: false,
						param: {
							service_id: this.serviceId,
							contract_id: this.contractId,
							set_id: 0,
							set_type: 3,
							custom_set_name: this.formData.custom_set_name,
							contract_company_id: this.contractCompanyId
						},
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure', {
							changed: true
						});
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};

export const ServiceSelfAdd = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-self-add {
	._btn {
		width: 60px;
		height: 60px;
		justify-content: center;
		align-items: center;
		border: 1px solid #d4d7db;
	}
	.ivu-modal-body {
		padding-top: 30px;
	}
	.ivu-modal-footer {
		border: none;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

