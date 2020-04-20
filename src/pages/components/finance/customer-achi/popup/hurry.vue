<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:mask-closable="false"
		>
			<div slot="header" class="g-tc">
				催下单
			</div>
			<i-form 
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="120" 
				class="g-m-t-20">
				<span>请选择推送范围</span>
				<i-formitem class="g-m-t-20" label="客户成交月份：" prop="deal_month" >
					<i-datepicker
						v-model="formdata.deal_month"
						:options="options"
						placeholder="请选择客户成交月份"
						style="width: 80%"
						type="month"
						transfer
					/>
				</i-formitem>
				<i-formitem label="到账状态：" prop="use_status">
					<i-select
						v-model="formdata.use_status"
						placeholder="请选择到账状态"
						multiple
						style="width: 80%"
						transfer
					>
						<i-option 
							v-for="item of achiStatus" 
							:value="item.value"
							:key="item.value">{{ item.label }}</i-option>
					</i-select>
				</i-formitem>
			</i-form>
			<div slot="footer">
				<i-button 
					type="primary" 
					@click="handleOk"
				>
					发送催单通知
				</i-button>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Select, Option, Form, FormItem, Row, Col, Spin, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { Confirm } from '@components/_common/confirm/confirm';
import { sign, achiStatus } from '../constants';

let hurryAchiStatus = [...achiStatus];
hurryAchiStatus.splice(1, 2);
export default {
	name: 'finance-customer-audit-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-row': Row,
		'i-col': Col,
		'i-button': Button,
	},
	props: {
		payment_id: Number,
	},
	data() {
		return {
			visible: false,
			formdata: {
			},
			achiStatus: hurryAchiStatus,
			validator: {
				deal_month: [{ required: true, type: 'date', message: '请选择客户成交月份', trigger: 'change' }],
				use_status: [{ required: true, type: 'array', message: '请选择到账状态', trigger: 'change' }],
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now() - 86400000;
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
				if (item) {
					const formdata = {
						...this.formdata,
						deal_month: moment(this.formdata.deal_month).format('YYYY-MM')
					};
					this.$request({
						url: API_ROOT._FINANCE_CUSTOMER_ACHI_HURRY_POST,
						type: 'POST',
						param: {
							...formdata,
						}
					}).then(suc => {
						this.$Message.success(suc.msg);
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
	}
};
export const HurryModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


