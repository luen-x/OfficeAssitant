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
			<i-form-item label="退款金额：" prop="refund_amount" >
				<i-input-number
					v-model="formData.refund_amount"
					:min="0"
					:max="99999999.99"
					:precision="2"
					:active-change="false"
					style="width: 220px"
					clearable
					placeholder="请输入退款金额"
				/>
			</i-form-item>
			<i-form-item label="退款月份：" prop="actual_month">
				<i-date-picker
					v-model="formData.actual_month"
					:options="dateOption"
					type="month"
					placeholder="请选择退款月份"
					clearable
					style="width: 220px"
				/>
			</i-form-item>
			<oa-title
				v-for="(item, index) of formData.projects"
				:key="item.project_id"
				style="paddingLeft: 12px"
			>
				<template slot="title">
					<span>{{ item.project_name }}</span>
				</template>
				<div slot="content" class="g-m-t-10" style="margin-left:-12px">
					<i-form-item
						:prop="`projects.${index}.refund_amount`"
						:rules="rules.refund_amount"
						label="退款金额："
					>
						<i-input-number
							v-model="item.refund_amount"
							:max="formData.refund_amount"
							:maxlength="11"
							:min="0"
							:precision="2"
							:active-change="false"
							style="width: 220px"
							clearable
							placeholder="请输入该产品退款金额"
						/>
					</i-form-item>
					<i-form-item
						:prop="`projects.${index}.cost_amount`"
						:rules="rules.cost_amount"
						label="退还成本："
					>
						<i-input-number
							v-model="item.cost_amount"
							:max="item.max_cost_amount"
							:min="0"
							:precision="2"
							:active-change="false"
							style="width: 220px"
							clearable
							placeholder="请输入从该产品退还的成本金额"
						/>
					</i-form-item>
				</div>
			</oa-title>
			<i-form-item label="通过说明：" prop="remarks">
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
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import { dataValidity, objRegex, getObjectValue } from '@utils/utils';
import Title from '@components/finance/_common/title';
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
		'oa-title': Title,
		'i-input-number': InputNumber,
		'oa-limit-words': LimitWords,
		'i-date-picker': DatePicker

	},
	props: {
		refundId: [Number, String],
		contractId: [Number, String]
	},
	data() {
		return {
			visible: false,
			formData: {
				
				"projects": [// 退款产品
					// {
					// 	"refund_amount": "5000", // 退款金额
					// 	"project_id": 4777,
					// 	"cost_amount": "1800"// 退还成本
					// }
				],
				"contract_id": this.contractId,
				"refund_amount": null, // 退款总金额
				"actual_month": "", // 退款月份
				"remarks": "", // 通过说明
				"refund_id": this.refundId, // 退款id
				refund_type: 1, //	1 产品退款 ， 2 换产品退款 ， 3 余额退款
				"type": 1, // 1：通过 2：驳回 // 固定为通过
			},
			rules: {
				refund_amount: [{ required: true, type: "number", message: '请输入退款金额', trigger: 'blur' }],
				value: [{ required: true, type: "number", message: '请输入退款金额', trigger: 'blur' }],
				service_amount: [{ required: true, type: "number", message: '请输入保留金额', trigger: 'blur' }],
				performance: [{ required: true, type: "number", message: '请输入需要扣除的业绩', trigger: 'blur' }],
				cost_amount: [
					{ required: true, type: "number", message: '请输入退还的成本', trigger: 'blur' },
					{ validator: this.costAmountValidator, trigger: 'blur' }
				],
				actual_month: [{ required: true, type: 'date', message: '请选择扣除月份', trigger: 'change' }],
				remarks: [{ required: true, message: '请输入通过说明', trigger: 'blur' }],
				is_keep: [{ required: true, type: 'number', message: '请选择保不保留', trigger: 'change' }]
			},
			dateOption: {
				disabledDate: (date) => {
					return date && (date.valueOf() < (new Date(this.month) - 86400000) || date.valueOf() > new Date());
				}
			},
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
				res.data.projects.forEach(it => {
					it.refund_amount = (+it.refund_amount >= 0 ? +it.refund_amount : null);
					it.max_cost_amount = (+it.cost_amount >= 0 ? +it.cost_amount : 0);
					it.cost_amount = (+it.cost_amount >= 0 ? +it.cost_amount : null);
				});
				if (res.data.projects.length === 1) {
					res.data.projects[0].refund_amount = res.data.refund_amount;
				}
				setData(this.formData, res.data);
			}).catch(err => err && console.error(err));
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					let allRefundAmount = 0;
					this.formData.projects.forEach(it => {
						allRefundAmount += (it.refund_amount || 0);
					});
					if (allRefundAmount !== this.formData.refund_amount) {
						this.$Message.error('所有产品的退款金额之和需等于退款总额');
						this.$refs.modal.buttonLoading = false;
						return;
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
		costAmountValidator(rule, value, callback) {
			const props = rule.field.split('.');
			const project = getObjectValue(this.formData, [props[0], props[1]]);
			if (project.refund_amount >= 0 && project.cost_amount >= 0 && project.refund_amount < project.cost_amount) {
				callback('退还成本应小于等于退款金额');
				return;
			}
			if (project.max_cost_amount >= 0 && project.cost_amount >= 0 && project.max_cost_amount < project.cost_amount) {
				callback('退还成本应小于等于实扣成本');
				return;
			}
			callback();
		}
	}
};
export const AuditProductRefund = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>