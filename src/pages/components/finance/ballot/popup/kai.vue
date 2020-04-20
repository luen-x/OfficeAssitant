<template>
	<div>
		<i-modal 
			ref="modal"
			v-model="visible" 
			:loading="true" 
			:width="400"
			:mask-closable="false"
			@on-ok="handleOk">
			<div slot="header" class="g-tc">
				开票
			</div>
			<i-form 
				ref="form" 
				:rules="validator" 
				:model="formdata" 
				:label-width="100" 
				class="g-m-t-20">
				<i-formitem prop="invoice_time" label="开票时间">
					<i-datepicker 
						v-model="formdata.invoice_time" 
						:options="options"
						placeholder="请选择开票时间" 
						type="datetime"
						style="width: 80%"
						transfer
					/>
				</i-formitem>
				<i-formitem prop="invoice_code" label="发票代码">
					<i-input
						v-model="formdata.invoice_code" 
						:maxlength="25"
						placeholder="请输入发票代码" 
						style="width: 80%" />
				</i-formitem>
				<i-formitem prop="invoice_num" label="发票号码">
					<i-input 
						v-model="formdata.invoice_num" 
						:maxlength="25"
						placeholder="请输入发票号码" 
						style="width: 80%" />
				</i-formitem>
				<i-formitem prop="amount" label="金额">
					<i-input-number
						v-model="formdata.amount" 
						:max="9999999999"
						:precision="2"
						:active-change="false"
						placeholder="请输入金额" 
						style="width: 80%" />
				</i-formitem>
				<i-formitem prop="tax_amount" label="税额">
					<i-input-number 
						v-model="formdata.tax_amount" 
						:max="9999999999"
						:precision="2"
						:active-change="false"
						placeholder="请输入税额" 
						style="width: 80%" />
				</i-formitem>
				<i-formitem label="总金额">
					<span>{{ (formdata.amount + formdata.tax_amount).toFixed(2) }}</span>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Input, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { dataValidity } from "@utils/utils";

export default {
	name: 'finance-customer-kai-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-formitem': FormItem,
	},
	props: {
		name: String,
		invoice_id: Number,
		onHide: Function,
		info: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			visible: false,
			formdata: {
				...this.info,
				amount: this.info.amount ? +this.info.amount : null,
				tax_amount: this.info.tax_amount ? +this.info.tax_amount : null,
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
			},
			validator: {
				invoice_time: [
					{ required: true, type: 'date', message: '请选择开票时间', trigger: 'change' }
				],
				invoice_code: [
					{ required: true, message: '请输入发票代码', trigger: 'blur' }
				],
				invoice_num: [
					{ required: true, message: '请输入发票号码', trigger: 'blur' }
				],
				amount: [{ required: true, type: 'number', message: '请输入金额', trigger: 'blur' }],
				tax_amount: [{ required: true, type: 'number', message: '请输入税额', trigger: 'blur' }],
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate((item) => {
				this.$refs['modal'].buttonLoading = false;
				if (item) {
					const formdata = {
						...this.formdata,
						invoice_time: moment(this.formdata.invoice_time).format('YYYY-MM-DD HH:mm:ss')
					};
					this.handleOpen(formdata);
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleOpen(formdata) {
			this.$request({
				url: API_ROOT._FINANCE_BALLOT_OPEN_POST,
				type: 'POST',
				param: {
					...formdata,
					invoice_id: this.invoice_id,
				}
			}).then(suc => {
				this.$store.commit('FINANCE_BALLOT_LIST_INIT');
				this.$Message.success(suc.msg);
				this.$emit('sure');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const KaiModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>
</style>


