<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:width="400"
			:mask-closable="false"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">
				退票
			</div>
			<i-form
				ref="form"
				:rules="validator"
				:model="formdata"
				:label-width="120"
				class="g-m-t-20">
				<i-formitem prop="return_time" label="退票时间：">
					<i-datepicker
						v-model="formdata.return_time"
						:options="options"
						placeholder="请选择退票时间"
						type="datetime"
						style="width: 80%"
						transfer
					/>
				</i-formitem>
				<i-formitem label="退票备注：">
					<oa-textarea
						v-model="formdata.return_remark"
						placeholder="请输入退票备注"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
				<i-formitem label="红字发票代码：">
					<i-input
						v-model="formdata.return_invoice_code"
						:maxlength="25"
						placeholder="请输入红字发票代码"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
				<i-formitem label="红字发票号码：">
					<i-input
						v-model="formdata.return_invoice_num"
						:maxlength="25"
						placeholder="请输入红字发票号码"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
				<i-formitem label="金额：">
					<i-inputnumber
						v-model="formdata.return_amount"
						:max="9999999999"
						:precision="2"
						:active-change="false"
						placeholder="请输入金额"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
				<i-formitem label="税额：">
					<i-inputnumber
						v-model="formdata.return_tax_amount"
						:max="9999999999"
						:precision="2"
						:active-change="false"
						placeholder="请输入税额"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
				<i-formitem label="总金额：">
					<span>{{ ((formdata.return_amount || 0) + (formdata.return_tax_amount || 0)).toFixed(2) }}</span>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Input, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from "@utils/utils";
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'finance-customer-kai-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-input': Input,
		'i-form': Form,
		'i-inputnumber': InputNumber,
		'i-formitem': FormItem,
		'oa-textarea': TextArea
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
				return_amount: this.info.return_amount ? +this.info.return_amount : null,
				return_tax_amount: this.info.return_tax_amount ? +this.info.return_tax_amount : null,
			},
			validator: {
				return_time: [
					{ required: true, type: 'date', message: '请选择退票时间', trigger: 'blur' }
				]
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
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
					let allinput = this.handleInputAll();
					const formdata = {
						...this.formdata,
						return_time: moment(this.formdata.return_time).format('YYYY-MM-DD HH:mm:ss')
					};
					allinput ? this.handleRecevie(formdata) : this.$Message.error('红字发票代码、号码、金额和税额需要都填写或者都为空');
				}
			});
		},
		handleInputAll() {
			let keys = ['return_amount', 'return_tax_amount', 'return_invoice_num', 'return_invoice_code'];
			let isAllTrue = keys.every(item => {
				return (!!this.formdata[item] || this.formdata[item] == 0);
			});
			let isAllFalse = keys.every(item => {
				return (!this.formdata[item] || this.formdata[item] == 0);
			});
			return isAllTrue || isAllFalse;
		},
		handleCancel() {
			this.$emit('close');
		},
		handleRecevie(formdata) {
			this.$request({
				url: API_ROOT._FINANCE_BALLOT_RETURN_INVOICE_POST,
				type: 'POST',
				param: {
					...formdata,
					invoice_id: this.invoice_id,
				}
			}).then(suc => {
				this.$store.commit('FINANCE_BALLOT_LIST_INIT');
				this.$Message.success(suc.msg);
				this.$emit('sure');
				this.onHide();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const RejectModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


