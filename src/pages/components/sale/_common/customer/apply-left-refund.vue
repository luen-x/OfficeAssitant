<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:title="data.title || '余额退款'"
		:mask-closable="false"
		width="400"
		class="v-sale-customer-apply-left-refund"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rule"
			:label-width="95"
			inline
			class="v-sale-customer-form"
		>
			<div >
				<i-form-item label="退款金额：" prop="refund_amount">
					<i-input-number
						v-model="formData.refund_amount"
						:min="0.01"
						:max="+restAmount"
						:active-change="false"
						:precision="2"
						:placeholder="'可退'+restAmount+'元'"
						style="width: 220px"
					/>
				</i-form-item>
				<i-form-item label="退款种类：" prop="refund_mode">
					<i-radio-group v-model="formData.refund_mode" class="_radio-group" @on-change="setRemarkRule">
						<i-radio :label="1">错录</i-radio>
						<i-radio :label="2">走账</i-radio>
						<i-radio :label="3">实际退款</i-radio>
						<i-radio :label="4">冲业绩</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-if="formData.refund_mode==3" class="_refund_reason_ids" label="退款原因：" prop="refund_reason_ids">
					<oa-tree-select-check
						ref="treeSelectCheck"
						v-model="formData.refund_reason_ids"
						:data="refundReasonTree"
						:width="220"
						:max-width="220"
						placeholder="请选择退款原因"
					/>
				</i-form-item>
				<i-form-item ref="remark" label="备注说明：" prop="remark" class="_remark">
					<oa-limit-words
						v-model="formData.remark"
						:max="200"
						width="220px"
						placeholder="请描述直接导致客户退款的某一件或某几件事情"
					/>
					<!-- <span class="g-c-black7">请描述直接导致客户退款的某一件或某几件事情</span> -->
				</i-form-item>
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, InputNumber, Button, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import API from '@stores/apis/root';
import LimitWords from "@components/_common/limit-words/limit-words";
import orderModal from '@extends/mixins/orderModal';
import TreeSelectCheck from '@components/_common/tree-select-check/tree-select-check';
import { services } from '@stores/services/sale';

import Explain from '../../../_common/explain/explain';

export default {
	name: "oa-sale-add-conatct",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-input-number': InputNumber,
		'oa-limit-words': LimitWords,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		'oa-explain': Explain,
		'oa-tree-select-check': TreeSelectCheck,

	},
	mixins: [orderModal, services.refundReasonTree()],
	props: {
		data: Object // {title,contract_company_id,refund_id (编辑才会有),contract_id, payment_amount 可退金额,payment_id 到账记录id,action}
	},
	data() {
		return {
			visible: false,
			productList: [],
			restAmount: this.data.rest_amount || '0.00',
			formData: {
				refund_id: this.data.action == 'update' ? this.data.refund_id : '', // 退款ID 编辑必选参数
				payment_id: this.data.payment_id || '',
				refund_type: 3, // 退款类型  1 产品退款 2 换产品退款 3 余额退款 
				refund_amount: null,
				refund_mode: 1,
				remark: '',
				original_refund_id: this.data.action == 'readd' ? this.data.refund_id : '',
				contract_company_id: this.data.contract_company_id || '',
				// 以下提交空数据
				product_id: [],
				contract_id: '',
				refund_project_id: [],
				refund_reason_ids: []
				
			},
			rule: {
				refund_mode: [{ required: true, type: "number", message: '请选择退款种类', trigger: 'change' }], // 退款类型 退款类型  1 错录 2 走账 3 实际退款
				refund_amount: [
					{ required: true, type: "number", message: '请填写退款金额', trigger: 'blur' },
					{ validator: this.refundAmountValidator, trigger: 'blur' }
				],
				refund_reason_ids: [
					{ required: true, type: "array", message: '请选择退款原因', trigger: 'change' },
					{ validator: this.refundReasonValidator, trigger: 'change' }
				],
				remark: [{ required: false, message: '请描述直接导致客户退款的某一件或某几件事情', trigger: 'blur' }],
				
			},
		};
	},
	watch: {
	
	},
	created() {
		if (this.data.refund_id) {
			this.loadRefundDetail();
			this.loadRestAmount();
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk(data) {
			this.visible = false;
			this.$emit('sure', data);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave: debounce(function () {
			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					let refund_reason_ids = [];
					if (this.formData.refund_mode == 3) {
						const checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
						refund_reason_ids = checkedTags.filter(ele => typeof ele.value == 'number').map(i => i.value);
					}
					this.$request({
						url: this.data.action == "update" ? API._SALE_REFUND_UPDATE_POST : API._SALE_REFUND_SAVE_POST,
						type: "POST",
						loading: false,
						param: {
							...this.formData,
							refund_reason_ids
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.handleOk(res.data);
					}).catch(res => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(res.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}, 200),
		
		loadRefundDetail() {
			this.$request({
				url: "_SAEL_REFUND_DETAIL_GET",
				type: "GET",
				param: { refund_id: this.data.refund_id },
				loading: false,
			}).then(res => {
				const { real_refund_amount, remark, refund_mode, payment_id, rest_amount, refund_reason_ids } = res.data.base_info;
				this.formData.refund_amount = +real_refund_amount;
				this.formData.remark = remark;
				this.formData.refund_mode = refund_mode;
				this.formData.payment_id = payment_id;
				this.formData.refund_reason_ids = refund_reason_ids || [];
				this.restAmount = rest_amount;
				this.setRemarkRule(refund_mode);
				
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		loadRestAmount() {
			this.$request({
				url: "_SALE_REFUND_PAYMENT_BALANCE_GET",
				type: "GET",
				param: {
					payment_id: this.data.payment_id,
					refund_id: this.data.action == 'update' ? this.data.refund_id : ''
				},
				loading: false,
			}).then(res => {
				this.restAmount = res.data.rest_amount;
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		refundAmountValidator(rule, value, callback) {
			if (value === 0) {
				callback('退款金额不能为0');
			} else callback();
		},
		refundReasonValidator(rule, value, callback) {
			const checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
			const refund_reason_ids = checkedTags.filter(ele => typeof ele.value == 'number').map(i => i.value);
			if (refund_reason_ids.length == 0) {
				callback('请选择退款原因');
			} else if (refund_reason_ids.length > 3) {
				callback("最多选择3个退款原因，请重新选择");
			} else callback();

		},
		setRemarkRule(value) {
			if (value == 3) {
				this.rule.remark[0].required = true;
				this.$refs.remark.setRules();
			} else {
				this.rule.remark[0].required = false;
				this.$refs.remark.setRules();
				this.$refs.form.validateField('remark');
			}

		}
	}
};

export const ApplyLeftRefund = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" >
.v-sale-customer-apply-left-refund {
	.v-sale-customer-form .ivu-radio-group .ivu-radio-group-item {
		margin-right: 5px;
		margin-left: 5px;
	}
	._refund_reason_ids {
		.ivu-form-item-content {
			line-height: 12px !important;
		}
	}
	._remark {
		.ivu-form-item-error-tip {
			width: 180px;
		}

	}
	
}
</style>