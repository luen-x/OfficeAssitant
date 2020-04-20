<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="标记续费"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
		@submit.native.prevent
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="120"
		>
			<i-form-item label="续费产品：" prop="product_ids">
				<i-select
					v-model="formData.product_ids"
					placeholder="请选择续费产品"
					style="width:220px"
					multiple
					clearable
					transfer
					@on-change="handleProdChange"
				>
					<i-option
						v-for="(item,index) in allProductList"
						:key="index"
						:value="item.product_id"
					>
						{{ item.product_name }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item 
				v-for="(prod,index) in formData.products"
				:key="prod.product_id" 
				:label="prod.product_name" 
				:prop="'products.'+index+'.amount'"
				:rules="rules.amount"
			>
				<i-input-number 
					v-model="prod.amount" 
					:max="9999999.99"
					:min="0.01" 
					:active-change="false" 
					:precision="2" 
					placeholder="请输入续费金额" 
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, InputNumber, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import { dataValidity, objRegex } from '@utils/utils';
import { CreatePortal } from 'wya-vc';


export default {
	name: "oa-sale-rebuy-sign",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		contractId: Number,
		productList: Array,
		renewProducts: Array
	},
	data() {
		const allProductList = this.productList.map(it => {
			const result = { product_id: it.product_id, product_name: it.product_name, amount: null };
			let cur = this.renewProducts.find(i => i.product_id === it.product_id);
			if (!cur) return result;
			if (cur.is_renew) {
				result.amount = +cur.renew_amount;
				return result;
			}
			if (cur.is_config_renew) {
				result.amount = +cur.config_renew_amount;
				return result;
			}
			return result;
		});
			
		const products = allProductList.filter(it => this.renewProducts.find(i => i.product_id === it.product_id && i.is_renew));
		return {
			visible: false,
			allProductList,
			formData: {
				contract_id: this.contractId,
				product_ids: products.map(i => i.product_id),
				products,
			},
			rules: {
				product_ids: [{ required: true, type: 'array', message: "请选择续费产品", trigger: "change" }],
				amount: [{ required: true, type: 'number', message: "请填写续费金额", trigger: "blur" }]
			},
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleProdChange(ids) {
			this.formData.products = this.allProductList.filter(p => ids.includes(p.product_id));
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_FINANCE_CUSTOMER_RENEW_SIGN_POST',
						type: "POST",
						param: {
							contract_id: this.contractId,
							product: this.formData.products.map(i => ({ product_id: i.product_id, amount: i.amount }))
						},
						loading: false 
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const RenewSign = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>