<template>
	<i-form 
		ref="form"
		:model="form" 
		:rules="ruleValidate"
		:label-width="100" 
		class="v-detail-form" 
		inline>
		<i-form-item prop="customer_name" label="客户姓名" class="g-m-r-20">
			<i-input 
				v-model="form.customer_name"
				style="width: 270px"
				disabled
			/>
		</i-form-item>
		<i-form-item prop="ratepayer_number" label="纳税人识别号" class="g-m-r-20">
			<i-input 
				:maxlength="32"								
				v-model="form.ratepayer_number"
				placeholder="请输入纳税人识别号"
				style="width: 270px"
			/>
		</i-form-item>
		<i-form-item prop="customer_phone" label="客户电话" class="g-m-r-20">
			<i-input 
				v-model="form.customer_phone"
				style="width: 270px"
				disabled
			/>
		</i-form-item>
		<i-form-item 
			ref="open_bank"
			prop="open_bank" 
			label="开户行" 
			class="g-m-r-20">
			<i-input 
				:maxlength="32"
				v-model="form.open_bank"
				placeholder="请输入开户行"
				style="width: 270px"
			/>
		</i-form-item>
		<i-form-item 
			ref="customer_address"
			prop="customer_address" 
			label="客户地址" 
			class="g-m-r-20"
		>
			<i-input 
				:maxlength="50"
				v-model="form.customer_address"
				placeholder="请输入客户地址"
				style="width: 270px"
			/>
		</i-form-item>
		<i-form-item 
			ref="public_account"
			prop="public_account" 
			label="对公账号" 
			class="g-m-r-20">
			<i-input
				:maxlength="32"
				v-model="form.public_account"
				placeholder="请输入对公账号"
				style="width: 270px"
			/>
		</i-form-item>
		<i-form-item prop="project" label="合作项目" class="g-m-r-20">
			<i-input 
				:maxlength="50"
				v-model="form.project"
				placeholder="请输入合作项目"
				style="width: 270px"
			/>
		</i-form-item>
		<i-form-item prop="invoice_money" label="发票金额" class="g-m-r-20">
			<span class="_number">元</span>
			<i-input-number
				:precision="2"
				v-model="form.invoice_money"
				placeholder="请输入发票金额"
				style="width: 270px"
				disabled
			/>
		</i-form-item>
		<i-form-item prop="invoice_type" label="发票类型" class="g-m-r-20">
			<i-radio-group v-model="form.invoice_type" style="width: 270px">
				<i-radio :label="1">增值税专用发票</i-radio>
				<i-radio :label="2">增值税普通发票</i-radio>
			</i-radio-group>
		</i-form-item>
		<i-form-item prop="payment_type_amount" label="汇款方式" class="g-m-r-20">
			<div 
				v-for="(item, index) of form.payment_type_amount" 
				:key="index" 
				:class="{ 'g-m-t-5': index }"
				class="g-flex g-jc-sb g-relative"
				style="width: 270px"
			>
				<i-form-item 
					:prop="`payment_type_amount.${index}.payment_type`" 
					:rules="ruleValidate.payment_type">
					<i-select
						v-model="item.payment_type"
						transfer
						clearable
						style="width: 150px"
					>
						<i-option 
							:value="1" 
							:disabled="form.payment_type_amount.some(item => item.payment_type === 1)">
							公司-公司</i-option>
						<i-option 
							:value="3"
							:disabled="form.payment_type_amount.some(item => item.payment_type === 3)"
						>个人-公司</i-option>
						<i-option 
							:value="6"
							:disabled="form.payment_type_amount.some(item => item.payment_type === 6)"
						>个人刷卡</i-option>
					</i-select>
				</i-form-item>
				<i-form-item
					:prop="`payment_type_amount.${index}.amount`" 
					:rules="ruleValidate.amount"
				>
					<span class="_number">元</span>
					<i-input-number
						:precision="2"
						:active-change="false"
						:min="0"
						v-model="item.amount"
						style="width: 110px"
						placeholder="请输入开票金额"
						@on-change="handleChangeNumber"
					/>
				</i-form-item>
				<div
					style="position: absolute; right: -80px; width: 80px"
				>
					<i
						v-if="form.payment_type_amount.length > 1"
						class="icon iconfont icon-remove-circle g-m-t-5 g-m-lr-5"
						style="font-size: 16px; color: #E74854"
						@click="() => handleItemDel(index)"
					/>
					<i
						v-if="index === form.payment_type_amount.length - 1"
						class="icon iconfont icon-add1 g-m-t-5 g-m-l-5"
						style="font-size: 16px; color: #2296f9"
						@click="handleItemAdd"
					/>
				</div>
			</div>
		</i-form-item>
		<i-form-item prop="invoice_title" label="发票抬头" class="g-m-r-20">
			<i-input 
				v-model="form.invoice_title"
				style="width: 270px"
				disabled
			/>
		</i-form-item>
		<i-form-item prop="contract_num" label="合同编号" class="g-m-r-20">
			<i-input 
				v-model="form.contract_num"
				:maxlength="100"
				multiple
				style="width: 270px"
			/>
		</i-form-item>
		<i-form-item prop="our_company_id" label="我方合同公司" class="g-m-r-20">
			<i-select
				v-model="form.our_company_id"
				style="width: 270px"
			>
				<i-option
					v-for="item of companyList"
					:key="item.contract_company_id"
					:value="item.contract_company_id">{{ item.company_name }}</i-option>
			</i-select>
		</i-form-item>
		<i-form-item prop="invoice_list" label="开票资料" class="g-m-r-20">
			<vc-imgs-picker
				:max="3"
				v-model="form.invoice_list"
				style="width: 270px"
				@error="handleError"
			/>
		</i-form-item>
		<i-form-item prop="voucher_list" label="打款凭证" class="g-m-r-20">
			<vc-imgs-picker
				:max="3"
				v-model="form.voucher_list"
				style="width: 270px"
				@error="handleError"
			/>
		</i-form-item>
		<i-form-item prop="contract_list" label="电子合同" class="g-m-r-20">
			<vc-imgs-picker
				:max="10"
				v-model="form.contract_list"
				style="width: 270px"
				@error="handleError"
			/>
		</i-form-item>
		<i-form-item 
			ref="entrusted_payment_list"
			prop="entrusted_payment_list"
			label="委托付款三方协议" 
			class="g-m-r-20">
			<vc-imgs-picker
				:max="10"
				v-model="form.entrusted_payment_list"
				style="width: 270px"
				@error="handleError"
			/>
		</i-form-item>
	</i-form>
</template>

<script>
import lodash from 'lodash';
import { Form, FormItem, Input, InputNumber, Select, Option, Radio, RadioGroup } from 'iview';
import { ImgsPicker, ImgsPreview } from 'wya-vc';
import { dataValidity } from "@utils/utils";

export default {
	name: 'ballot-detail-form',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'vc-imgs-picker': ImgsPicker
	},
	props: {
		info: Object
	},
	data() {
		return {
			form: {
				...(lodash.cloneDeep(this.info)),
				payment_type_amount: this.info.payment_type_amount.length 
					? lodash.cloneDeep(this.info.payment_type_amount) : [{ amount: null, payment_type: '' }],
				invoice_money: +this.info.invoice_money,
			},
			companyList: [],
			ruleValidate: {
				invoice_title: [
					{ required: true, message: '请输入开票公司名称' }
				],
				payment_type_amount: [
					{ required: true, type: 'array', message: '请选择汇款方式' }
				],
				payment_type: [
					{ required: true, type: 'number', message: '请选择汇款方式' }
				],
				amount: [
					{ required: true, type: 'number', message: '请输入开票金额' }
				],
				invoice_type: [
					{ required: true, message: '请选择发票类型' }
				],
				customer_name: [
					{ required: true, message: '请输入客户姓名' }
				],
				customer_phone: [
					{ required: true, message: '请输入客户电话' }
				],
				invoice_money: [
					{ required: true, message: '输入发票金额' }
				],
				contract_id: [
					{ required: true, message: '请输入合同编号', }
				],
				our_company_id: [
					{ required: true, type: 'number', message: '请选择我方合同公司å' }
				],
				ratepayer_number: [
					{ required: true, message: '请输入纳税人识别号' },
					{ type: 'validLetterAndNumber', message: '请输入字母或数字', validator: dataValidity, trigger: 'blur' }
				],
				customer_address: [
					{ required: this.info.invoice_type === 1, message: '请输入客户地址', trigger: 'blur' }
				],
				project: [
					{ required: true, message: '请输入合作项目' }
				],
				public_account: [
					{ required: this.info.invoice_type === 1, message: '请输入对公账号' },
					{ pattern: /(^\d{1,32}$)/, message: '请输入数字', trigger: 'blur' }
				],
				voucher_list: [
					{ required: true, message: '请选择打款凭证' }
				],
				contract_list: [
					{ required: true, message: '请选择电子合同' }
				],
				invoice_list: [
					{ required: true, message: '请选择开票资料' }
				],
				entrusted_payment_list: [
					{ 
						required: !this.info.is_personal && !!this.info.payment_type_amount.find(
							item => item.payment_type === 3 || item.payment_type === 6
						),
						message: '请选择委托付款三方协议' 
					}
				],
				open_bank: [
					{ required: this.info.invoice_type === 1, message: '请输入开户行' },
					{ type: 'validName', message: '请输入中文或英文', validator: dataValidity, trigger: "blur" }
				]
			}

		};
	},
	computed: {
		// 如果发票选择了非个人公司 并且 汇款方式选了个人公司或个人刷卡，委托付款三方协议为必填，其他情况委托付款三方协议为选填
		entrustedPaymentRequired() {
			
			const personalPayment = this.form.payment_type_amount.find(item => item.payment_type === 3 || item.payment_type === 6);
			return !this.info.is_personal && personalPayment;	
		}
	},
	watch: {
		entrustedPaymentRequired(newVal) {
			this.ruleValidate.entrusted_payment_list[0].required = !!newVal;
			this.$refs.entrusted_payment_list.setRules();
		},
		'form.invoice_type': function (newVal) {
			['customer_address', 'public_account', 'open_bank'].forEach(field => {
				this.ruleValidate[field][0].required = newVal == 1;
				this.$refs[field] && this.$refs[field].setRules();
			});
		}
	},

	mounted() {
		this.loadCompany();
	},
	methods: {
		handleItemDel(index) {
			this.form.payment_type_amount.splice(index, 1);
			this.handleReduce();
		},
		handleItemAdd() {
			this.form.payment_type_amount.push({ amount: null });
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleChangeNumber() {
			this.handleReduce();
		},
		handleReduce() {
			// let sum = 0;
			// this.form.payment_type_amount.forEach(item => {
			// 	sum += item.amount;
			// });
			// this.form.invoice_money = sum;
			let sum = this.form.payment_type_amount.reduce((item, a) => { 
				let pre = a.amount;
				let next = typeof item.amount === 'number' ? item.amount : item;
				return pre + next; 
			});
			this.form.invoice_money = typeof sum === 'number' ? sum : sum.amount;
		},
		loadCompany() {
			this.$request({
				url: '_FINANCE_OUR_COMPANY_GET',
				param: {},
				type: 'GET',
				loading: false
			}).then(res => {
				this.companyList = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-detail-form {
	._number {
		position: absolute;
		z-index: 10;
		right: 23px;
		top: 2px;
	}
}
</style>


