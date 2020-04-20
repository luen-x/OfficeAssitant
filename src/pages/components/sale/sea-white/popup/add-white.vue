<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		class="v-sale-sea-add-white"
		width="400"
		@on-ok="handleOk" 
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			
			<span>添加客户</span>
		</div>
		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item 
				label="公司名称：" 
				prop="company_name" 
				class="_cus-error-tip"
			>
				<i-input 
					v-model="formData.company_name"
					:maxlength="50"
					placeholder="请输入公司名称"
				/>
			</i-form-item>
			<i-form-item 
				label="客户电话："
				prop="tel" 
				class="_cus-error-tip"
			>
				<i-input 
					v-model="formData.tel" 
					placeholder="请输入公司电话"
				/>
			</i-form-item>
			<i-form-item label="客户姓名：" prop="customer_name">
				<i-input 
					:maxlength="10"
					v-model="formData.customer_name" 
					placeholder="请输入客户姓名"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Input, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-sea-add-white",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem
	},
	mixins: [orderModal],
	data() {
		return {
			visible: false,
			formData: {// 表单
				company_name: '',
				tel: '',
				customer_name: ''
			},
			rules: {// 表单验证
				company_name: [
					{ required: true, message: '公司名称不能为空', trigger: 'blur' },
					{ type: 'validName', message: '公司名称格式不正确', validator: dataValidity },
					{ validator: this.hasCompanyName, trigger: 'blur' }
				],
				tel: [
					{ required: true, message: '电话号码不能为空', trigger: 'blur' },
					{ validator: this.hasTel, trigger: 'blur' }
				],
				customer_name: [
					{ required: true, message: '客户姓名不能为空', trigger: 'blur' },
					{ type: 'validName', message: '客户姓名格式不正确', validator: dataValidity }
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
						url: '_SALE_SEA_WHITE_ADD_POST',
						type: 'POST',
						loading: false,
						param: {
							type: 0,
							...this.formData
						},
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure', {
							status: res.status
						});
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
			this.$emit('close');
		},
		/**
		 * 验证公司名称是否存在
		 */
		hasCompanyName(rule, value, callback) {
			this.$request({
				url: '_SALE_INTENTION_CHECK_NAME_GET',
				type: "GET",
				loading: false,
				param: {
					company_name: value
				},
				autoTip: false
			}).then(res => {
				if (res.data.msg != '未重名') {
					callback(res.data.msg);
				} else {
					callback();
				}
			}).catch(error => {
				callback(error.msg);
			});
		},
		/**
		 * 验证手机号是否存在
		 */
		hasTel(rule, value, callback) {
			this.$request({
				url: '_SALE_INTENTION_CHECK_TEL_GET',
				type: "GET",
				loading: false,
				param: {
					tel: value
				},
				autoTip: false
			}).then(res => {
				if (res.data.msg != '未重名') {
					callback(res.data.msg);
				} else {
					callback();
				}
			}).catch(error => {
				callback(error.msg);
			});
		}
	}
};

export const SeaAddWhite = CreatePortal({}, module.exports.default);

</script>
<style lang="scss">
.v-sale-sea-add-white {
	._cus-error-tip {
		.ivu-form-item-error-tip {
			position: relative;
			margin-bottom: -20px;
			line-height: 20px;
			top: -2px;
		}
	}
	.ivu-modal-body {
		padding-top: 30px;
	}
	.ivu-input {
		width: 220px;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

