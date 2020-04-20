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
				领票
			</div>
			<i-form
				ref="form"
				:rules="validator"
				:model="formdata"
				:label-width="100"
				class="g-m-t-20">
				<i-formitem prop="invoice_number" label="开票份数">
					<i-inputnumber
						v-model="formdata.invoice_number"
						:max="100000000"
						placeholder="请输入开票份数"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
				<i-formitem prop="receive_holder" label="领票人">
					<i-input
						v-model="formdata.receive_holder"
						:maxlength="10"
						placeholder="请输入领票人"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
				<i-formitem prop="invoice_amount_sheets" label="开票张数">
					<i-inputnumber
						v-model="formdata.invoice_amount_sheets"
						:max="100000000"
						placeholder="请输入开票张数"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
				<i-formitem prop="receive_time" label="领票时间">
					<i-datepicker
						v-model="formdata.receive_time"
						:options="options"
						placeholder="请选择领票时间"
						type="datetime"
						style="width: 80%"
						transfer
					/>
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

export default {
	name: 'finance-customer-kai-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-input': Input,
		'i-form': Form,
		'i-inputnumber': InputNumber,
		'i-formitem': FormItem,
	},
	props: {
		name: String,
		invoice_id: Number,
		onHide: Function
	},
	data() {
		return {
			visible: false,
			formdata: {
				invoice_number: null,
				invoice_amount_sheets: null
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
			},
			validator: {
				invoice_number: [
					{ required: true, type: 'number', message: '请输入开票份数', trigger: 'blur' }
				],
				receive_holder: [
					{ required: true, message: '请输入领票人', trigger: 'blur' },
					{ type: 'validName', message: '请输入中文或英文', validator: dataValidity, trigger: "blur" }
				],
				invoice_amount_sheets: [
					{ required: true, type: 'number', message: '请输入开票张数', trigger: 'blur' }
				],
				receive_time: [
					{ required: true, type: 'date', message: '请选择领票时间', trigger: 'blur' }
				],
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
						receive_time: moment(this.formdata.receive_time).format('YYYY-MM-DD HH:mm:ss')
					};
					this.handleRecevie(formdata);
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleRecevie(formdata) {
			this.$request({
				url: API_ROOT._FINANCE_BALLOT_RECEVIE_POST,
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
export const LingModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


