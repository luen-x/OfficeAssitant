<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			title="通过申请"
			@on-ok="handleOk"
		>
			
			<i-form
				ref="form"
				:model="formdata"
				:rules="validator"
				:label-width="100"
				class="g-m-t-20">
				<template v-if="name === '1'">
					<i-formitem prop="refund_amount" label="退款金额:">
						<i-inputnumber
							v-model="formdata.refund_amount"
							:min="0"
							style="width: 80%"
							clearable
							placeholder="请输入退款金额"
						/>
					</i-formitem>
					<!--  1 产品退款 ， 2 换产品退款 ， 3 余额退款 -->
					<template v-if="(refund_type === 3 || refund_type === 4)">
						<i-formitem
							v-for="(item, index) of formdata.percents"
							:label="item.label + ':'"
							:key="item.id"
							:prop="`percents.${index}.value`"
							:rules="validator.value"
						>
							<i-inputnumber
								v-model="item.value"
								:max="item.max"
								:min="0"
								style="width: 80%"
								clearable
								placeholder="请输入需要扣回的成本金额"
							/>
						</i-formitem>
						<i-formitem label="业绩扣除月份:" prop="actual_month">
							<i-datepicker
								v-model="formdata.actual_month"
								:options="options"
								style="width: 80%"
								clearable
								type="month"
								placeholder="请选择业绩扣除月份"
								transfer
							/>
						</i-formitem>
					</template>
					<template v-else>
						<i-formitem label="提成扣除月份:" prop="actual_month">
							<i-datepicker
								v-model="formdata.actual_month"
								:options="options"
								style="width: 80%"
								clearable
								type="month"
								placeholder="请选择提成扣除月份"
								transfer
							/>
						</i-formitem>
						<i-formitem
							v-if="formdata.has_service_amount"
							label="服务提成:"
							prop="is_keep">
							<i-radio-group
								v-model="formdata.is_keep"
								style="width: 80%"
							>
								<i-radio :label="0">不保留</i-radio>
								<i-radio :label="1">部分保留</i-radio>
							</i-radio-group>
						</i-formitem>
						<i-formitem
							v-if="formdata.has_service_amount&&formdata.is_keep==1"
							prop="service_amount"
							label="保留金额:">
							<i-inputnumber
								v-model="formdata.service_amount"
								:max="formdata.max"
								:min="0"
								style="width: 80%"
								clearable
								placeholder="请输入保留金额"
							/>
						</i-formitem>
						<oa-title
							v-for="(item, index) of formdata.projects"
							:key="item.project_id"
							style="paddingLeft: 12px"
						>
							<template slot="title">
								<span>{{ item.project_name }}</span>
							</template>
							<div slot="content">
								<i-formitem
									:prop="`projects.${index}.cost_amount`"
									:rules="validator.cost_amount"
									:label-width="88"
									:class="{ 'g-m-t-20': !index }"
									label="退还成本:"
								>
									<i-inputnumber
										v-model="item.cost_amount"
										:max="item.max"
										:min="0"
										style="width: 80%"
										clearable
										placeholder="请输入从该产品退还的成本金额"
									/>
								</i-formitem>
							</div>
						</oa-title>
						<oa-title
							v-if="formdata.pro.length"
							style="paddingLeft: 12px"
						>
							<template slot="title">
								<span>促单业绩</span>
							</template>
							<div slot="content">
								<i-formitem
									v-for="(item, index) of formdata.pro"
									:label="item.staff_name + ':'"
									:key="item.staff_id"
									:prop="`pro.${index}.performance`"
									:rules="validator.performance"
									:label-width="88"
								>
									<i-inputnumber
										v-model="item.performance"
										:max="item.max"
										:min="0"
										:placeholder="item.type === 'depart' ?
										'请输入该部门需要扣除的业绩' : '请输入从该讲师需要扣除的促单业绩'"
										style="width: 80%"
										clearable
									/>
								</i-formitem>
							</div>
						</oa-title>
						<oa-title
							v-if="formdata.team_performance.length"
							style="paddingLeft: 12px"
						>
							<template slot="title">
								<span>团队业绩</span>
							</template>
							<div slot="content">
								<i-formitem
									v-for="(item, index) of formdata.team_performance"
									:label="item.depart_name + ':'"
									:key="item.depart_id"
									:prop="`team_performance.${index}.performance`"
									:rules="validator.performance"
									:label-width="88"
								>
									<i-inputnumber
										v-model="item.performance"
										:max="item.max"
										:min="0"
										style="width: 80%"
										clearable
										placeholder="请输入从该部门需要扣除的团队业绩"
									/>
								</i-formitem>
							</div>
						</oa-title>
					</template>
				</template>
				<i-formitem :label="typeName + ':'" prop="remarks">
					<i-textarea
						v-model="formdata.remarks"
						:placeholder="placeholder"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Timeline, TimelineItem, Input, InputNumber,
	Radio, RadioGroup } from 'iview';
import { CreatePortal } from 'wya-vc';
import Title from '@components/finance/_common/title';
import TextArea from '@components/_common/limit-words/limit-words';
import moment from 'moment';

export default {
	name: 'finance-customer-audit-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-textarea': TextArea,
		'i-form': Form,
		'oa-title': Title,
		'i-input': Input,
		'i-inputnumber': InputNumber,
		'i-formitem': FormItem,
		'i-timeline': Timeline,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-timeline-item': TimelineItem
	},
	props: {
		name: String,
		show: {
			type: Boolean,
			default: () => true,
		},
		type: String,
		refund_id: Number,
		refund_type: Number,
		requestFn: Function,
		detail_info: Object
	},
	data() {
		return {
			visible: false,
			formdata: {
				percents: [],
				projects: [],
				pro: [],
				team_performance: []
			},
			month: '',
			timelineVisible: false,
			validator: {
				refund_amount: [
					{ required: true, type: "number", message: '请输入退款金额', trigger: 'blur' }
				],
				value: [
					{ required: true, type: "number", message: '请输入退款金额', trigger: 'blur' }
				],
				service_amount: [
					{ required: true, type: "number", message: '请输入保留金额', trigger: 'blur' }
				],
				performance: [
					{ required: true, type: "number", message: '请输入需要扣除的业绩', trigger: 'blur' }
				],
				cost_amount: [
					{ required: true, type: "number", message: '请输入退还的成本', trigger: 'blur' }
				],
				actual_month: [
					{ required: true, type: 'date', message: '请选择扣除月份', trigger: 'change' }
				],
				remarks: [{
					required: true,
					message: `请输入${this.name === '1' ? '通过说明' : '驳回原因'}`,
					trigger: 'blur'
				}],
				is_keep: [
					{ required: true, type: 'number', message: '请选择保不保留', trigger: 'change' }
				]
			}
		};
	},
	computed: {
		typeName() {
			return this.name === '1' ? '通过说明' : '驳回原因';
		},
		placeholder() {
			return `请输入${this.typeName}`;
		},
		options() {
			return {
				disabledDate: (date) => {
					return date && (date.valueOf() < (new Date(this.month) - 86400000) || date.valueOf() > new Date());
				}
			};
		},
	},
	mounted() {
		this.visible = true;
		this.name === '1' && this.loadData();
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate(item => {
				this.$refs['modal'].buttonLoading = false;
				if (item) {
					this.requestFn({
						data: {
							...this.formdata,
							actual_month: moment(this.formdata.actual_month).format('YYYY-MM')
						},
						cb: () => this.$emit('destory')
					});
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		loadData() {
			this.$request({
				url: '_FINANCE_REFUND_AUDIT_INFO_GET',
				type: 'GET',
				param: {
					refund_id: this.refund_id
				},
			}).then(res => {
				const { percents = [] } = res.data;
				res.data.refund_amount = +res.data.refund_amount;
				res.data.actual_month = new Date();
				this.month = res.data.month;
				this.formdata = res.data;
			}).catch(err => {

			});
		},
	}
};
export const RefundAuditModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


