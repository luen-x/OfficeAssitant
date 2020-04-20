<template>
	<div class="v-sale-customer-account-record-product-info g-m-t-20">
		<div>
			<span class="_title-bar g-bg-red-mid"/>
			<span class="g-fs-14 g-m-l-5 g-m-r-20">产品信息</span>
			<template v-if="showOption">
				<template v-if="isEdit">
					<span class="g-operation" @click="handleSave">保存</span>
					<span class="g-operation g-m-l-10" @click="handleCancel">取消</span>
				</template>
				<span v-else class="g-operation" @click="handleEdit">编辑</span>
			</template>
			
		</div>
		<div v-if="isEdit" class="g-m-t-10" >
			<i-select
				ref="select"
				v-model="selectIds"
				:remote-method="handleSearch"
				:loading="loading"
				label-in-value
				multiple
				filterable
				remote
				transfer
				style="width: 220px"
				placeholder="输入产品名称搜索"
				@on-change="handleSelectChange"
			>
				<i-option
					v-for="(item,index) in productList"
					:key="index"
					:value="item.product_id"
				>
					{{ item.product_name }}
				</i-option>
			</i-select>
			<i-button
				type="primary"
				class="g-red-btn g-m-l-5"
				@mouseup.native="handleSure"
			>
				确认
			</i-button>
		</div>
		<div style="min-height:100px" class="g-m-t-10">
			<span 
				v-for="(item,index) in (isEdit? productsShow:productsShowChild)" 
				:key="item.product_id+'-'+item.parent_product_id" 
				class="_source-item"
			>
				{{ item.product_name }}
				<template v-if="item.staff_name">
					<span style="padding:0 6px">|</span>
					{{ item.make_depart_name }}
					<span style="padding:0 6px">|</span>
					{{ item.staff_name }}
				</template>
				<i
					v-if="isEdit"
					class="icon iconfont icon-close2 g-pointer g-m-l-10"
					style="font-size: 12px;"
					@click="handleDelete(index,item)"
				/>
			</span>
		</div>
	</div>
</template>
<script>
import { Input, Button, Select, Option } from 'iview';
import { debounce } from 'lodash';
import { Confirm } from '@common/confirm/confirm';

export default {
	name: 'oa-sale-customer-account-record-popup-product-info',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		products: {
			type: Array, 
			default: () => []
		},
		showOption: [Boolean, Number],
		disabled: [Boolean, Number],
		paymentId: [Number, String]

	},
	data() {
		let originProducts = [];
		 this.products.forEach(product => {
			if (product.parent_product_id) {
				const exist = originProducts.find(_pro => {
					return _pro.product_id == product.parent_product_id;
				});
				if (exist) {
					exist.child_products.push(product);
				} else {
					const parent = { product_id: product.parent_product_id, product_name: product.parent_product_name, child_products: [product] };
					originProducts.push(parent);
				}
			} else {
				originProducts.push(product);
			}
		});
		return {
			originProducts: [...originProducts], // 编辑之前的产品
			productList: [], // 搜索到的产品
			productsShow: [...originProducts], // 显示的产品,不展开子产品
			selectProducts: [], // select v-model
			selectIds: [],
			productListCach: [...originProducts], // 搜索到的产品缓存
			isEdit: false,
			loading: false,
			search: ''
		};
	},
	computed: {
		productsShowChild() { // 显示的产品,展开子产品
			let target = [];
			this.productsShow.forEach(product => {
				if (product.child_products && product.child_products.length) {
					target = [...target, ...product.child_products];
				} else {
					target.push(product);
				}
			});
			return target;
		}
	},
	watch: {
		paymentId() {
			this.isEdit = false;
		},
		products(products) {
			let originProducts = [];
			products.forEach(product => {
				if (product.parent_product_id) {
					const exist = originProducts.find(_pro => {
						return _pro.product_id == product.parent_product_id;
					});
					if (exist) {
						exist.child_products.push(product);
					} else {
						const parent = { 
							product_id: product.parent_product_id, 
							product_name: product.parent_product_name, 
							child_products: [product] 
						};
						originProducts.push(parent);
					}
				} else {
					originProducts.push(product);
				}
			});
			this.originProducts = [...originProducts]; // 编辑之前的产品
			this.productList = []; // 搜索到的产品
			this.productsShow = [...originProducts]; // 显示的产品,不展开子产品
			this.selectProducts = []; // select v-model
			this.selectIds = [];
			this.productListCach = [...originProducts]; // 搜索到的产品缓存
			this.isEdit = false;
			this.loading = false;
			this.search = '';
		}

	},
	methods: {
		handleSave: debounce(function () {
			// this.isEdit = false;
			this.$request({
				url: "_SALE_PAYMENT_PRODUCT_EDIT_POST",
				type: "POST",
				param: {
					product_ids: this.productsShowChild.map(it => ({ product_id: it.product_id, parent_product_id: it.parent_product_id || 0 })),
					payment_id: this.paymentId
				},
				loading: true,
			}).then(res => {
				this.isEdit = false;
				this.originProducts = [...this.productsShow];
				this.$Message.success(res.msg);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}, 200),
		handleSearch: debounce(function (search) {
			this.loading = true;
			this.$request({
				url: "_SALE_PRODUCT_LIST_GET",
				type: "GET",
				loading: false,
				param: {
					search,
				}
			}).then(res => {
				this.loading = false;
				this.productList = res.data; 
				this.productList.forEach(el => {
					if (!this.productListCach.find(item => el.product_id == item.product_id)) {
						this.productListCach.push(el);
					}
				});
			}).catch(res => {
				this.loading = false;
			});
		}, 300),
		handleCancel() {
			this.productsShow = [...this.originProducts];
			this.selectIds = [];
			this.selectProducts = [];
			this.isEdit = false;
		},
		handleSure() {
			this.selectProducts.forEach(el => {
				if (!this.productsShow.find(item => el.product_id == item.product_id)) {
					this.productsShow.push(el);
				}
			});
			this.selectIds = [];
		},
		handleSelectChange(val) {
			this.selectProducts = val.map(item => {
				return this.productListCach.find(it => it.product_id == item.value);
			});
		},
		handleDelete(index) {
			this.productsShow.splice(index, 1);

		},
		handleEdit() {
			if (this.disabled) {
				Confirm.popup({ msg: '余额已被使用不可编辑', okText: '知道了', cancelText: '' }).catch(() => {});
			} else {
				this.isEdit = true;
			}
		}
	}
};
</script>
<style lang="scss">
.v-sale-customer-account-record-product-info {
	._source-item {
        border-radius: 2px;
        padding: 5px 10px; 
        display: inline-block;
        background-color: #e84854;
        color: white;
		margin: 5px;
		cursor: pointer;
		&:hover{
			background-color: #fa646e;
		}
    }
}
</style>