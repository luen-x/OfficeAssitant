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
				变更客户
			</div>
			<i-form
				ref="form"
				:model="formdata"
				:label-width="100"
				:rules="validator"
				class="g-m-t-20">
				<i-formitem prop="contract_company_name" label="合同公司名称:">
					<i-input
						v-model="formdata.contract_company_name"
						:maxlength="50"
						style="width: 80%"
						clearable
						placeholder="请输入合同公司名称"
					/>
				</i-formitem>
				<i-formitem prop="customer_name" label="客户姓名">
					<i-input
						v-model="formdata.customer_name"
						:maxlength="10"
						disabled
						placeholder="请输入客户姓名"
						clearable
						style="width: 80%"
					/>
				</i-formitem>
				<i-formitem prop="link_tel_id" label="客户手机号">
					<i-select
						v-model="formdata.link_tel_id"
						transfer
						style="width:220px"
						placeholder="请选择客户联系电话"
						@on-change="handleLinkTelChange"
					>
						<i-option
							v-for="(item) in linkTelList"
							:key="item.link_id"
							:value="item.link_id"
						>
							{{ item.phone }}
						</i-option>
					</i-select>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Input, InputNumber, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from "@utils/utils";

export default {
	name: 'finance-customer-detail-change-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		name: String,
		show: {
			type: Boolean,
			default: () => true
		},
		requestFn: Function,
		param: Object
	},
	data() {
		return {
			visible: false,
			formdata: this.param,
			validator: {
				contract_company_name: [
					{ required: true, message: '请输入合同公司名称', trigger: 'blur' },
					{ pattern: /[\u4e00-\u9fa5a-zA-Z()（）]{1,51}/, message: "企业类型只能填写中、英文和括号", trigger: "blur" }
				],
				customer_name: [
					{ required: true, message: '请输入客户姓名', trigger: 'blur' },
					{ type: 'validCompellation', message: '客户姓名请用中英文', validator: dataValidity, trigger: "blur" }
				],
				link_tel_id: [
					{ required: true, type: 'number', message: '请选择手机号', trigger: 'blur' }
				]
			},
			linkTelList: []
		};
	},
	mounted() {
		this.visible = true;
		this.loadPaymentCustomerCompanys();
	},
	methods: {
		loadPaymentCustomerCompanys() {
			this.$request({
				url: '_SALE_PAYMENT_CUSTOMER_COMPANY',
				type: "GET",
				loading: false,
				param: {
					customer_id: this.param.customer_id,
					contract_company_id: this.param.contract_company_id
				}
			}).then(({ data }) => {
				this.linkTelList = data.link_tels.filter(v => objRegex.validMobile.regex.test(v.phone));
				if (this.linkTelList.length === 0) {
					this.$Message.error('没有可以变更的客户手机号');
				}
				if (!this.linkTelList.find(it => it.link_id === this.formdata.link_tel_id)) {
					this.formdata.link_tel_id = '';
				}

			}).catch(res => {
				this.$Message.error(res.msg);
			});
		},
		handleOk() {
			this.$refs['form'].validate((item) => {
				this.$refs['modal'].buttonLoading = false;
				if (item) {
					this.requestFn({
						data: this.formdata,
						cb: () => this.$emit('destory')
					});
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleLinkTelChange(linkId) {
			const link = this.linkTelList.find(item => item.link_id === linkId);
			if (link) {
				this.formdata.customer_name = link.customer_name;
			}

		}
	}
};
export const ChangeModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


