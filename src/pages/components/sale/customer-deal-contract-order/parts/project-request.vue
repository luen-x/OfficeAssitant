<template>
	<div>
		<oa-title v-if="productList.length>0" style="margin-left:73px;margin-bottom:20px" mode="red">项目需求</oa-title>
		<!-- <div
			v-if="productList.length>0"
			class="g-fs-16 g-c-red-mid g-m-tb-20"
			style="border-left: 2px red solid;padding-left: 10px;line-height: 16px;margin-left:73px"
		>项目需求</div> -->
		<oa-cus-form
			v-for="(product) in productList"
			ref="cusForm"
			:key="product.uuid"
			:configs="product.configs"
			:specs="product.specs"
			:sku="product.sku"
			:is-cost-instalment="product.is_cost_instalment"
		>
			<div slot-scope="{data}" style="margin-left:81px;">
				<div >
					<span class="g-c-black1 ">{{ product.product_name }}</span>
					<i-poptip
						v-if="data.cost_type == 1"
						:content="data.cost_tips"
						transfer
						word-wrap
						trigger="hover"
					>
						<i
							class="iconfont icon-question g-c-orange-mid g-m-l-5 g-pointer"
						/>
					</i-poptip>
					<span class="g-operation g-m-l-10" @click="handleRemoveProduct(product)">删除</span>
				</div>
				<div class="g-m-tb-10" >
					<span class="g-m-r-20">
						<span class="g-m-r-5">价格: </span>
						<span v-if="data.price">{{ data.price }}</span>
						<span v-else class="g-c-black4">选择规格后显示 </span>
					</span>
					<span v-if="data.cost">
					<span class="g-m-r-5">成本:</span> {{ data.cost }}</span>
					<i-checkbox 
						v-if="product.configs.can_gift" 
						v-model="product.configs.is_gift" 
						class="g-fr" 
						style="margin-right: 30px;"
						@click.native="handleClickGift(product.configs)"
					>
						赠送
					</i-checkbox>
				</div>
			</div>
		</oa-cus-form>
	</div>
</template>
<script>
import { Input, Button, Poptip, Checkbox } from 'iview';
import { Confirm } from '@common/confirm/confirm';
import Title from '@common/title/title';
import CusForm, { formatProductDetail, formatCheckValue } from '../../_common/customer/cus-form/cus-form';


export default {
	name: 'oa-order-project-request',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-cus-form': CusForm,
		'oa-title': Title,
		'i-poptip': Poptip,
		'i-checkbox': Checkbox
	},
	props: {
		productList: {
			type: Array,
			default: () => []
		},
		contractCompanyId: [Number, String]

	},
	data() {
		return {
		};
	},
	methods: {
		handleRemoveProduct(product) {
			const index = this.productList.findIndex(pro => (
				pro.product_id == product.product_id 
				&& pro.parent_product_id == product.parent_product_id
			));
			const parentProductId = product.parent_product_id;
			if (parentProductId) {
				Confirm.popup({ 
					title: '组合产品删除提示',
					 msg: "当前删除产品是组合产品的子产品，如果删除该产品将会将该组合产品及其子产品一起删除，确认删除吗？" 
				}).then(() => {
					this.removeCoopProducts(parentProductId);
					this.$emit('remove-product');
				}).catch((err) => { err && console.error(err); });
			} else {
				Confirm.popup({
					title: '删除提示',
					msg: "确认删除该产品吗？"

				}).then(() => {
					this.productList.splice(index, 1);
					this.$emit('remove-product');
				}).catch((err) => err && console.error(err));
				
			}
		},
		loadProductDetail(productId, contractCompanyId, parentProductId) {
			this.$request({
				url: API._SALE_PRODUCT_DETAIL_GET,
				type: "GET",
				loading: false,
				param: {
					product_id: productId,
					contract_company_id: contractCompanyId,
					parent_product_id: parentProductId,
				}

			}).then(res => {
				res.data.configs = formatProductDetail(
					res.data.request.product_component,
					res.data.product_id,
					parentProductId,
					{ 
						sku: res.data.sku,
						selected_sku: undefined, 
						has_sku: res.data.has_sku,
						price: res.data.price,
						cost: res.data.cost,
						is_cost_instalment: res.data.is_cost_instalment,
						price_unit_name: res.data.price_unit_name,
						can_gift: res.data.can_gift,
						is_gift: !!res.data.is_gift
					}
				);
				res.data.uuid = Math.random();
				this.productList.push(res.data);
			}).catch(res => {
				console.error(res);
			});
		},
		setProductList(list) {
			this.productList = list;
		},
		removeCoopProducts(parentProductId) {
			if (this.productList.length === 0) return;
			const index = this.productList.findIndex(prod => prod.parent_product_id === parentProductId);
			if (index > -1) {
				this.productList.splice(index, 1);
				this.removeCoopProducts(parentProductId);
			}
		},
		handleClickGift(product) {
			window.event.preventDefault();
			window.event.stopPropagation();
			if (product.is_gift) {
				product.is_gift = false;
			} else {
				Confirm.popup({ 
					title: '确认', 
					msg: '赠送产品的成本默认由邀约人独自承担，确认赠送该产品？', 
					status: 'question' 
				}).then(() => {
					product.is_gift = true;
				}).catch((err) => {
					err && console.error(err);
				});
			}
		},
		getFormData() {
			return this.$refs.cusForm.map(cusF => cusF.getFormData());
		},
		getForm() {
			return this.$refs.cusForm.map(cusF => cusF.getForm());
		},
		getCusForm() {
			return this.$refs.cusForm;
		}
	}
};
</script>
<style lang="scss">
</style>