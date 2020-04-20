<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="700"
			:loading="true"
			:mask-closable="false"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">修改缴款方式</div>
			<i-form 
				v-if="loading" 
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="90" 
				class="g-m-t-20">
				<i-formitem 
					v-for="(item, index) of formdata.payment_method" 
					:key="index" 
					:label="index === 0 ? '缴款方式:' : ''"
					prop="payment_method"
				>
					<i-datepicker
						v-model="item.payment_time" 
						:options="options"
						style="width: 180px;marginRight:5px"
						transfer
					/>
					<i-cascader
						v-model="item.methods"
						:data="payMethod"
						style="width: 260px;marginRight:5px"
						transfer
					/>
					<i-input 
						v-model="item.payment_amount"
						disabled
						style="width: 120px"
					/>
				</i-formitem>
			</i-form>
			<i-spin v-else fix/>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Select, Option, Cascader, Input, Row, Col, Spin } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { services } from '@stores/services/finance';

export default {
	name: 'finance-customer-edit-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-row': Row,
		'i-col': Col,
		'i-spin': Spin,
		'i-cascader': Cascader
	},
	mixins: [services.payMethod()],
	props: {
		name: String,
		payment_info: Object,
		requestFn: Function
	},
	data() {
		let { payment_method = [] } = this.payment_info;
		payment_method.forEach(item => {
			item.methods = [item.method_id, item.item_id];
		});
		return {
			visible: false,
			formdata: {
				...this.payment_info,
				payment_method
			},
			loading: true,
			validator: {
				payment_method: [
					{ required: true, type: 'array', message: '请选择缴款方式', trigger: 'blur' }
				]
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
			},
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate((item) => {
				if (item) {
					this.handleModify();
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleModify() {
			this.$refs['modal'].buttonLoading = false;
			let { payment_id, payment_method } = this.formdata;
			payment_method.forEach(item => {
				item.payment_time = moment(item.payment_time).format('YYYY-MM-DD');
				item.method_id = item.methods.length && item.methods[0];
				item.item_id = item.methods.length && item.methods[1];
			});
			const formdata = {
				payment_id,
				payment_method
			};
			this.requestFn({
				data: formdata,
				cb: () => this.$emit('destory')
			});
		}
	}
};
export const EditModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


