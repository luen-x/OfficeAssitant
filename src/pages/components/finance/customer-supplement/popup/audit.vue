<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:mask-closable="false"
		>
			<div slot="header" class="g-tc">
				{{ name === '1' ? '通过申请' : '驳回申请' }}
			</div>
			<i-form 
				v-if="spin"
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="100" 
			>
				<div v-if="name === '1'">
					<oa-title 
						v-for="(item, index) of formdata.pockets_info"
						:key="index"
						class="g-m-t-10" 
						style="paddingLeft: 12px"
					>
						<template slot="title">
							<span class="g-fs-14">到账业绩归属: {{ item.actual_month }}</span>
						</template>
						<div slot="content" class="g-m-t-10">
							<div 
								style="background: #f1f1f1; padding: 10px; margin-top: 10px"
								class="g-flex g-fw-w"
							>
								<span style="marginRight: 40px;">实付金额: {{ item.pocket_info.pay_amount }}</span>
								<span style="marginRight: 40px;">剩余金额: {{ item.pocket_info.rest_amount }}</span>
								<span>使用金额: {{ item.pocket_info.lock_amount }}</span>
							</div>
							<i-formitem 
								:label="label" 
								:rules="validator.after_month"
								:prop="`pockets_info.${index}.after_month`" 
								class="g-m-t-10" >
								<i-datepicker
									v-model="item.after_month"
									:placeholder="`请选择${label}`"
									:options="options"
									style="width: 80%"
									type="month"
									transfer
								/>
							</i-formitem>
						</div>
					</oa-title>
				</div>
				<i-formitem 
					v-if="!supply_id && name === '1'"
					label="付款时间" 
					prop="payment_time" 
					class="g-m-t-10" >
					<i-datepicker
						v-model="formdata.payment_time"
						:options="options2"
						placeholder="请选择付款时间"
						style="width: 80%"
						transfer
					/>
				</i-formitem>
				<i-formitem
					:label="type"  
					prop="remarks" 
				>
					<oa-textarea 
						v-model="formdata.remarks"
						:placeholder="placeholder"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
			</i-form>
			<i-spin v-else fix />
			<div slot="footer">
				<i-button 
					type="text" 
					@click="handleCancel"
				>
					取消
				</i-button>
				<i-button 
					type="primary" 
					@click="handleOk"
				>
					确定
				</i-button>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Row, Col, Spin, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import Title from '@components/finance/_common/title';
import TextArea from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'finance-customer-contract-audit-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'oa-textarea': TextArea,
		'i-form': Form,
		'i-formitem': FormItem,
		'oa-title': Title,
		'i-row': Row,
		'i-col': Col,
		'i-spin': Spin,
		'i-button': Button
	},
	props: {
		name: String,
		show: {
			type: Boolean,
			default: () => true
		},
		state: String,
		payment_id: Number,
		contract_id: Number,
		contract_company_id: Number,
		supply_id: Number,
		requestFn: Function,
		label: {
			type: String,
			default: () => '提成归属月份'
		}
	},
	data() {
		return {
			visible: false,
			spin: true,
			formdata: {
				pockets_info: []
			},
			month: new Date(),
			validator: {
				after_month: [{ required: true, type: 'date', message: `请选择${this.label}`, trigger: 'change' }],
				payment_time: [{ required: true, type: 'date', message: '请选择付款时间', trigger: 'change' }],
				remarks: [{ 
					required: true, 
					message: `请输入${this.name === '1' ? '通过说明' : '驳回原因'}`, 
					trigger: 'blur' 
				}]
			}
		};
	},
	computed: {
		type() {
			return this.name === '1' ? '通过说明' : '驳回原因';
		},
		placeholder() {
			return `请输入${this.type}`;
		},
		options() {
			return {
				disabledDate: (date) => {
					return date && date.valueOf() > new Date();
				}
			};
		},
		options2() {
			return {
				disabledDate: (date) => {
					return date && (date.valueOf() < (new Date(this.month) - 86400000) || date.valueOf() > new Date());
				}
			};
		}
	},
	mounted() {
		this.visible = true;
		this.name === '1' && this.loadData();
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate((item) => {
				const { pockets_info } = this.formdata;
				let month_data = [];
				pockets_info.forEach(val => {
					let obj = {};
					obj.before_month = val.actual_month;
					obj.after_month = moment(val.after_month).format('YYYY-MM');
					month_data.push(obj);
				});
				if (item) {
					const formdata = {
						month_data,
						remarks: this.formdata.remarks,
						payment_time: moment(this.formdata.payment_time).format('YYYY-MM-DD')
					};
					this.requestFn({
						data: formdata,
						cb: () => { this.visible = false; this.$emit('sure'); }
					});
				}
			});
		},
		handleCancel() {
			if ((this.name === '1' && this.show === true && this.formdata.month) || this.formdata.remarks) {
				Modal.confirm({
					title: '提示',
					content: '取消后你所填写的内容将无法恢复，确认取消？',
					width: 400,
					onOk: () => {
						this.visible = false;
						this.$emit('destory');
					}
				});
			} else {
				this.visible = false;
			}
		},
		loadData() {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_CONTRACT_AUDIT_INFO_GET,
				type: 'GET',
				param: {
					contract_id: this.contract_id,
					contract_company_id: this.contract_company_id,
					supply_id: this.supply_id
				},
				loading: false
			}).then(res => {
				res.data.pockets_info.forEach(item => {
					item.after_month = item.actual_month;
				});
				this.formdata = res.data;
				this.month = this.formdata.payment_time;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const ContractAuditModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


