<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-royalty-return"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>要求重新回访</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="请输入理由：" prop="return_visit_mark">
				<oa-limit-words 
					v-model="formData.return_visit_mark"
					:max="500"
					placeholder="请输入让质检部门重新回访的理由"
					clearable
					style="width: 80%"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-royalty-return",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords,
	},
	mixins: [orderModal],
	props: {
		contractCompanyId: [String, Number]
	},
	data() {
		return {
			visible: false,
			formData: {// 表单
				return_visit_mark: ''
			},
			rules: {// 表单验证
				return_visit_mark: [
					{ required: true, message: '请输入理由', trigger: 'blur' }
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
						url: '_SALE_SERVICE_REQUIRED_AGAIN_VISIT_POST',
						type: "POST",
						loading: false,
						param: {
							...this.formData,
							contract_company_id: this.contractCompanyId
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

export const ServiceRoyaltyReturn = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-royalty-return {
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

