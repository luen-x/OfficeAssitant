<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="通过申请"
		width="400" 
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="100"
			class="g-pd-l-20"
		>
			<i-form-item label="退款金额：" prop="refund_amount">
				<i-input-number 
					v-model="formData.refund_amount" 
					:max="99999999.99"
					:min="0" 
					:precision="2"
					:active-change="false"
					placeholder="请输入退款金额" 
					style="width: 220px"/>
			</i-form-item>
			<i-form-item
				v-for="(item, index) of formData.percents"
				:label="item.label + ':'"
				:key="item.id"
				:prop="`percents.${index}.value`"
				:rules="rules.value"
			>
				<i-input-number
					v-model="item.value"
					:max="formData.refund_amount"
					:min="0"
					:precision="2"
					:active-change="false"
					style="width: 220px"
					clearable
					placeholder="请输入需要扣回的成本金额"
				/>
			</i-form-item>
			<i-form-item label="业绩扣除月份:" prop="actual_month">
				<i-date-picker
					v-model="formData.actual_month"
					:options="dateOption"
					style="width: 220px"
					clearable
					type="month"
					placeholder="请选择业绩扣除月份"
					transfer
				/>
			</i-form-item>
			<i-form-item label="通过说明:" prop="remarks">
				<oa-limit-words
					v-model="formData.remarks"
					:max="200"
					style="width: 220px"
					placeholder="请填写通过说明"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, InputNumber, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, DatePicker } from 'iview';
import Explain from '@components/_common/explain/explain';
import LimitWords from '@components/_common/limit-words/limit-words';
import moment from 'moment';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import { setData } from '../../../sale/_common/util';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'oa-limit-words': LimitWords,
		'i-date-picker': DatePicker

	},
	props: {
		refundId: [Number, String], // refund_id
		contractId: [Number, String],
	},
	data() {
		return {
			visible: false,
			formData: {
				"percents": [
					// {
					// 	"id": "1977", // id
					// 	"depart_id": "95",
					// 	"first_depart_id": 0,
					// 	"label": "杭四三部三",
					// 	"value": 9000, // 填写的金额
					// 	"is_invite": 1, // 是否邀约人
					// 	"type": "inner"// 分单人信息
					// },
					// {
					// 	"id": "167",
					// 	"depart_id": 0,
					// 	"first_depart_id": 0,
					// 	"label": "线上培训中心",
					// 	"value": 1000,
					// 	"is_invite": 0,
					// 	"type": "depart"
					// }
				],
				"refund_amount": null, // 退款金额
				"actual_month": "", // 扣除月份
				"remarks": "", // 备注
				"refund_id": this.refundId, // 退款id
				contract_id: this.contractId,
				refund_type: 3, //	1 产品退款 ， 2 换产品退款 ， 3 余额退款
				"type": "1"// 1：通过 2：驳回 // 固定为通过
			},
			dateOption: {
				disabledDate: (date) => {
					return date && (date.valueOf() < (new Date(this.month) - 86400000) || date.valueOf() > new Date());
				}
			},
			
			rules: {
				refund_amount: [{ required: true, type: "number", message: '请输入退款金额', trigger: 'blur' }],
				value: [{ required: true, type: "number", message: '请输入退款金额', trigger: 'blur' }],
				service_amount: [{ required: true, type: "number", message: '请输入保留金额', trigger: 'blur' }],
				performance: [{ required: true, type: "number", message: '请输入需要扣除的业绩', trigger: 'blur' }],
				cost_amount: [{ required: true, type: "number", message: '请输入退还的成本', trigger: 'blur' }],
				actual_month: [{ required: true, type: 'date', message: '请选择扣除月份', trigger: 'change' }],
				remarks: [{ required: true, message: '请输入通过说明', trigger: 'blur' }],
				is_keep: [{ required: true, type: 'number', message: '请选择保不保留', trigger: 'change' }]
			}
		};
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					let all = 0;
					this.formData.percents.forEach(per => {
						all += (per.value || 0);
					});
					if (all !== this.formData.refund_amount) {
						this.$Message.error('分单的退款金额之和必须等于总退款金额');
						return this.$refs.modal.buttonLoading = false;
					}
					this.$request({
						url: '_FINANCE_CUSTOMER_REFUND_MONEY_AUDIT_POST',
						type: "POST",
						param: {
							...this.formData,
							actual_month: moment(this.formData.actual_month).format('YYYY-MM')

						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		loadData() {
			this.$request({
				url: '_FINANCE_REFUND_AUDIT_INFO_GET',
				type: 'GET',
				param: {
					refund_id: this.refundId
				},
			}).then(res => {
				const { percents = [] } = res.data;
				res.data.refund_amount = +res.data.refund_amount;
				res.data.actual_month = new Date();
				this.month = res.data.month;
				setData(this.formData, res.data);
			}).catch(err => err && console.error(err));
		},
	}
};
export const AuditLeftRefund = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>