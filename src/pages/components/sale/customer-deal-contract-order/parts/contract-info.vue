<template>
	<div>
		<i-form 
			ref="form"
			:model="form" 
			:rules="rule" 
			:label-width="144" 
			class="g-m-t-20"
			inline
		>
			<i-form-item label="合同类型：" prop="contract_type">
				<i-radio-group v-model="form.contract_type" >
					<i-radio :label="0" style="margin-left:0">新建合同</i-radio>
					<i-radio :label="1" style="position: relative">
						补充协议
						<oa-explain 
							class="g-m-l-5"
							style="transform: translateY(0px);position: absolute;left: 0x;top: -2px;font-size:16px;width:30px"
							title="当客户想合作”一品一代“、“零售分享”等不能单独购买的产品时，选择补充协议，关联已经下单的合同"
							content="举例：客户A先合作了微商系统，之后希望再合作“一品一代”，此时选择补充协议，并关联微商系统的合同"
						/>
					</i-radio>
					<!-- 移除产品退款和换产品退款 -->
					<!-- <i-radio :label="2" style="position: relative">
						更换产品
						<oa-explain 
							class="g-m-l-5"
							style="transform: translateY(0px);position: absolute;left: 0x;top: -2px;font-size:16px;width:30px"
							title="当客户需要换产品时先在被换产品上（客户合同详情中）申请更换产品，将原来的产品退掉之后再重新下单，下单时选择合同类型更换产品。"
							content="举例：客户需要将80张海报更换为50张海报+4个小视频，需要先将80张海报申请换产品退款退掉，然后重新下单，合同类型选择更换产品即可。"
						/>
					</i-radio> -->
					<i-radio :label="3">续费合同</i-radio>
				</i-radio-group>
			</i-form-item><br>
			<i-form-item v-if="form.contract_type == 2" label="有新合同：" prop="has_new_contract">
				<i-radio-group v-model="form.has_new_contract" style="width: 300px">
					<i-radio :label="1" style="margin-left:0;width:66px" >是</i-radio>
					<i-radio :label="0" style="position: relative">否</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item
				v-if="form.contract_type == 1 ||form.contract_type == 2 || form.contract_type === 3"
				:prop="'parent_contract_id'+form.contract_type"
				:rules="rule.parent_contract_id"
				label="原合同编号："
			>
				<i-select
					v-model="form['parent_contract_id'+form.contract_type]"
					transfer
					clearable
					placeholder="请选择原合同编号"
					style="width: 300px"
				>
					<i-option
						v-for="(item,index) in parentContract[form.contract_type]"
						:key="index"
						:value="item.contract_id"
					>
						{{ item.contract_num }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item 
				v-if="(form.contract_type == 2 && form.has_new_contract==1) || form.contract_type==0 || form.contract_type==3" 
				:key="2" 
				label="合同编号："
				prop="contract_num"
			>
				<i-input
					v-model="form.contract_num"
					:maxlength="20"
					style="width: 300px"
					placeholder="请输入合同编号"
					clearable
				/>
			</i-form-item>
			<i-form-item ref="contract_amount" label="合同金额：" prop="contract_amount">
				<i-input-number
					v-model="form.contract_amount"
					:max="20000000"
					:min="0"
					:active-change="false"
					:precision="2"
					placeholder="请输入合同金额"
					style="width: 300px"
					clearable
				/>
			</i-form-item>
			<i-form-item label="应付金额：" prop="need_amount">
				<i-input-number
					v-model="form.need_amount"
					:max="20000000"
					:min="0"
					:active-change="false"
					:precision="2"
					placeholder="请输入应付金额"
					style="width: 300px"
					clearable
				/>
			</i-form-item>
			<i-form-item label="实付金额：" prop="payment_amount">
				<i-input-number
					v-model="form.payment_amount"
					:max="20000000"
					:min="0"
					:active-change="false"
					:precision="2"
					placeholder="请输入实付金额"
					style="width: 300px"
					clearable
				/>
			</i-form-item>
			<i-form-item ref="negotiatorItem" label="谈判人：" prop="negotiator" >
				<i-select
					ref="select"
					v-model="form.negotiator"
					:remote-method="loadStaffList"
					:loading="searchLoading"
					style="width: 300px"
					filterable
					remote
					multiple
					transfer
					placeholder="请输入名称搜索"
					@on-change="handleNegotiatorChange"
				>
					<i-option
						v-for="(item,index) in staffList"
						:key="index"
						:value="item.staff_id"
					>
						{{ item.staff_name }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="选择产品：" prop="productList" >
				<div style="width:300px">
					<i
						class="iconfont icon-add1 g-c-blue-mid g-pointer g-fs-16"
						@click="handleChooseProduct"
					/>
				</div>
			</i-form-item>
		</i-form>
	</div>
</template>
<script>
import { Input, Button, FormItem, Radio, RadioGroup, Select, Option, InputNumber, Form } from 'iview';
import Explain from '@common/explain/explain';
import { getHashUrl, dataValidity } from '@utils/utils';


export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber
	},
	props: {
		contractCompanyId: [Number, String],
		form: Object,
		initStaffList: {
			type: Array,
			default: () => []
		},
		validatePaymentAmount: Function
	},
	data() {
		return {
			parentContract: {
				1: undefined,
				2: undefined,
				3: undefined
			},
			staffList: [...this.initStaffList],
			searchLoading: false,
			me: { staff_id: _global.staff.staff_id, staff_name: _global.staff.staff_name },
			rule: {
				has_new_contract: [{ required: true, type: 'number', message: '请选择是否有新合同', trigger: 'change' }],
				contract_type: [{ required: true, type: 'number', message: '请选择合同类型', trigger: 'change' }], // 合同类型 0 新合同 1补充协议 2更换合同 3 续费合同
				contract_num: [
					{ required: true, message: "请输入合同编号", trigger: 'change' },
					{ type: 'validLetterAndNumber', message: '只能输入数字或字母', validator: dataValidity, trigger: 'change' },
					{ required: true, validator: this.contractNumValidator, trigger: 'change' }
				], // 合同编号
				parent_contract_id: [
					{ required: true, type: 'number', message: "请选择原合同", trigger: 'change' }
				], // 合同编号
				parent_contract_ids: [{ required: true, type: 'array', message: "请选择原合同编号", trigger: 'change' }],
				contract_amount: [{ required: true, type: 'number', message: "请输入合同金额", trigger: 'blur' }],
				need_amount: [
					{ required: true, type: 'number', message: "请输入合同优惠后的金额", trigger: 'blur' }
					// { validator: this.needAmountValidator, trigger: 'blur' }
				],
				payment_amount: [
					{ required: true, type: 'number', message: "请输入实付金额", trigger: 'blur' }
					// { validator: this.paymentAmountValidator, trigger: 'blur' }
				],
				negotiator: [{ required: true, type: 'array', validator: this.validateNegotiator, trigger: "change" }],
				productList: [{ required: true, type: 'array', message: "请选择产品", trigger: 'change' }],
			},
		};
	},
	watch: {
		initStaffList(val) {
			this.staffList = val;
		},
		'form.contract_type': function (newVal, oldVal) {
			if (newVal == 3 || oldVal == 3) {
				this.$emit('clear-product');
			}
			this.loadParentContract(newVal);
		}
	},
	created() {
		if (this.form.contract_type) this.loadParentContract(this.form.contract_type);

	},
	methods: {
		loadParentContract(type) {
			if (type == 0) return;
			if (type == 1 && this.parentContract[type] && this.parentContract[type].length == 0) {
				this.$Message.error("没有可关联的合同");
			}
			if (type == 2 && this.parentContract[type] && this.parentContract[type].length == 0) {
				this.$Message.error("没有可更换的合同");
			}
			if (type == 3 && this.parentContract[type] && this.parentContract[type].length == 0) {
				this.$Message.error("没有可续费的合同");
			}
			
			if (this.parentContract[type]) return;
			this.$request({
				url: "_SALE_CONTRACT_PARENT_CONTRACT_GET",
				type: "GET",
				param: {
					contract_company_id: this.$route.query.contract_company_id,
					contract_type: type
				},
				loading: false,
			}).then(res => {
				this.parentContract[type] = res.data;
				if (type == 1 && res.data.length == 0) {
					this.$Message.error("没有可关联的合同");
					return;
				}
				if (type == 2 && res.data.length == 0) {
					this.$Message.error("没有可更换的合同");
					return;
				}
				if (type == 3 && res.data.length == 0) {
					this.$Message.error("没有可续费的合同");
					return;
				}
				
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadStaffList(query) {
			this.searchLoading = true;
			this.$request({
				url: "_SALE_PAYMENT_STAFF_LIST_GET",
				type: "GET",
				loading: false,
				param: {
					search: query,
					is_page: 0
				}
			}).then(res => {
				this.searchLoading = false;
				const list = res.data.list;
				const index = list.findIndex(item => {
					return item.staff_id == this.me.staff_id;
				});
				if (index > -1) {
					list.splice(index, 1);
				}
				list.splice(0, 0, this.me);
				this.staffList = list;
			}).catch(res => {
				this.searchLoading = false;
				console.error(res);
			});
		},
		handleNegotiatorChange(val) {
			// if (this.form.negotiator.length > 3) {
			// 	this.form.negotiator.pop();
			// }
		},
		handleChooseProduct() {
			this.$emit('choose-product');
		},
		validateNegotiator(rule, value, callback) {
			if (!value || value.length == 0) return callback("请选择谈判人");
			if (value.length > 3) return callback("谈判人不能超过三个");
			return callback();
		},
		validateProductList(rule, value, callback) {
			if (!needValidateFrom1) return callback();
			if (!value || value.length == 0) return callback(new Error("请选择产品"));
			return callback();
		},
		setFormData() {

		},

		contractNumValidator(rule, value, callback) {
			if (value.includes(' ')) return callback('请输入字母或数字');
			this.$request({
				url: "_SALE_CONTRACT_NUM_VALIDATE_GET",
				type: "GET",
				param: {
					contract_num: value,
					contract_id: this.form.contract_id || ''
				},
				loading: false,
			}).then(res => {
				callback();
			}).catch((res) => {
				console.error(res);
				callback(res.msg);
				
			});
		},
		needAmountValidator(rule, value, callback) {
			if (value !== null && this.form.contract_amount !== null && value > this.form.contract_amount) {
				callback("应付金额应小于等于合同金额");
			} else {
				callback();
			}
		},
		paymentAmountValidator(rule, value, callback) {
			// 实付金额应小于等于应付金额
			if (this.form.need_amount !== null && value !== null && value > this.form.need_amount) {
				callback('实付金额应小于等于应付金额');
				return;
			}
			// 实付金额应小于等于可用余额
			if (value !== null && this.balance !== null && value > +this.balance) {
				callback('实付金额应小于等于可用余额');
				return;
			}
			// 实付金额需大于等于所有产品的的实扣成本
			if (this.validatePaymentAmount) {
				const result = this.validatePaymentAmount(value);
				if (!result.status) {
					callback(result.msg);
					return;
				}
			}
			callback();

			
		}

	}
};
</script>
<style lang="scss">
</style>