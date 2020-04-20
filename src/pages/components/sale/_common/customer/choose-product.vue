<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="选择产品"
		class="v-sale-choose-product g-tabs-card"
		width="680"
		@on-ok="handleConfirm"
		@on-cancel="handleCancel"
	>
		<div class="g-flex g-jc-c g-m-b-20">
			<i-input
				v-model="search"
				placeholder="请输入关键字搜索"
				style="width: 220px"
				class="g-m-r-10"
				clearable
				@on-enter="handleSearch"
				@on-change="handleClear"

			/>
			<i-select
				v-if="type==1"
				v-model="category_id"
				clearable
				class="g-m-r-10"
				style="width: 220px"
				placeholder="请选择产品分类"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item,index) in productTypeList"
					:key="index"
					:value="item.category_id"
				>
					{{ item.category_name }}
				</i-option>
			</i-select>
			<i-button type="primary" @click="handleSearch">搜索</i-button>
		</div>
		<i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			@on-click="handleChangeTab"
		>
			<i-tab-pane
				v-for="(item,tabIndex) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
			>
				<i-table
					ref="table"
					:columns="columns[item.value]"
					:data="tableData[item.value]"
					:loading="loading"
					height="250"
					width="646"
					no-filtered-data-text="没有搜索到该产品，请检查关键字"
					no-data-text="没有搜索到该产品，请检查关键字"
					@on-select="handleSelect"
					@on-select-cancel="handleSelectCancel"
					@on-row-click="(row,index)=>handleRowClick(row,index,tabIndex)"

				/>
			</i-tab-pane>
		</i-tabs>
		<div slot="footer" class="g-flex">
			<div class="g-m-l-10 g-flex g-col" style="margin-top:7px;font-size:13px">
				
				<span style="width:55px;height:20px">已选择：</span>
				<div style="width:425px;" class="g-tl">
					<span v-for="(pro,index) in selectedProducts" :key="pro.product_id" class="g-c-blue-mid " >
						<span v-if="pro.product_name.length<=6">{{ pro.product_name }}</span>
						<i-poptip v-else trigger="hover" transfer>
							<span class="g-pointer">{{ pro.product_name.substr(0,6) }}...</span>
							<div slot="content">
								{{ pro.product_name }}
							</div>
						</i-poptip>
						{{ index== selectedProducts.length-1 ?'':'，' }} 
					</span>
				</div>
			</div>
			<div style="position: absolute;right: 20px;bottom: 15px;">
				<i-button size="large" type="text" @click="handleCancel">取消</i-button>
				<i-button type="primary" size="large" @click="handleConfirm">确定</i-button>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Input, Table, Checkbox, Icon, Select, Option, Poptip, Tabs, TabPane } from 'iview';
import { CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import API from '@stores/apis/root';
import { services } from '@stores/services/sale';
import orderModal from '@extends/mixins/orderModal';
import ProductExplain from './wrapper/product-explain';

export default {
	name: "oa-choose",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-input': Input,
		'i-table': Table,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-poptip': Poptip
	},
	mixins: [services.productTypeList(), orderModal],
	props: {
		selected: {
			type: Array,
			default: () => []
		},
		isRenew: Boolean,
		expandProduct: Boolean
	},

	data() {
		const columns0 = [
			{
				title: ' ',
				key: '-',
				width: 60,
				type: 'selection'
			},
			{
				title: '产品名称',
				key: 'product_name',
				minWidth: 250,
				render: (h, params) => {
					return <ProductExplain name={params.row.product_name} describe={params.row.product_describe}/>;
				},
			},
				
			{
				title: '标准价格',
				key: 'price_str',
				width: 200
			}
		];
		const columns1 = [...columns0];
		columns1.splice(2, 0, {
			title: '分类',
			key: 'category_name',
			width: 100,
		});
		return {
			visible: false,
			search: '',
			category_id: '',
			loading: false,
			columns: {
				1: columns1,
				2: columns0

			},			
			
			tableData: {
				1: [],
				2: [],
			},
			type: '2',
			selectedProducts: this.expandProduct ? this.getInitSelected() : [...this.selected],
			tabs: [{ label: "组合产品", value: '2', load: false }, { label: '单个产品', value: '1', loaded: false }],
		};
	},
	computed: {
	},
	created() {
		
	},
	mounted() {
		this.visible = true;
		this.handleSearch();
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleConfirm: debounce(function () {
			if (!this.selectedProducts.length) {
				this.$Message.error("请选择产品");
				this.$refs.modal.buttonLoading = false;
				return;
			}
			if (!this.checkProducts()) {
				this.$Message.error("组合产品的子产品重复，请重新选择产品");
				this.$refs.modal.buttonLoading = false;
				return;
			}
			
			this.visible = false;
			this.$emit('sure', this.expandProduct ? this.getExpandSelects() : this.selectedProducts);

		}, 200),
		checkProducts() {
			const productIds = [];
			for (let i = 0; i < this.selectedProducts.length; i++) {
				if (productIds.includes(this.selectedProducts[i].product_id)) {
					return false;					
				} else {
					productIds.push(this.selectedProducts[i].product_id);
				}
				const childs = this.selectedProducts[i].child_products;
				if (childs && childs.length > 0) {
					for (let j = 0; j < childs.length; j++) {
						if (productIds.includes(childs[j].product_id)) {
							return false;							
						} else {
							productIds.push(childs[j].product_id);
						}
					}
				}
			}
			return true;
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSearch() {
			this.tableData = { 1: [], 2: [] }; 
			this.tabs.forEach(item => {
				item.loaded = false;
				
			});
			this.loadData();
		},
		loadData() {
			this.loading = true;
			const tabType = this.type;
			this.$request({
				url: '_SALE_PRODUCT_LIST_GET',
				type: "GET",
				loading: false,
				param: {
					search: this.search,
					category_id: this.type == '1' ? this.category_id : '',
					type: tabType
				}
			}).then(res => {
				this.loading = false;
				// res.data.forEach(item => {
				// 	item.checked = false;
				// });
				const curTab = this.tabs.find(item => {
					return item.value == tabType;
				});
				curTab.loaded = true;
				res.data.forEach(row => {
					row._checked = !!this.selectedProducts.find(pro => pro.product_id == row.product_id);
					
					let price;
					if (row.product_type == 1) {
						const arr = [];
						row.child_products.forEach(child => {
							if (!arr.find(i => i.product_id == child.product_id)) {
								arr.push(child);
							}
						});
						let total = 0;
						arr.forEach(pro => {
							total += parseFloat(pro.price);
						});
						price = total.toFixed(2) + ' 元';
						// 多规格时去重
						row.child_products = arr;

					} else {
						price = row.product_sku[0].price + ' 元';
					}
					row.price_str = price;

				});
				this.tableData[tabType] = res.data;
			}).catch(res => {
				this.loading = false;
				console.error(res);
			});
		},
		handleChangeTab(type) {
			this.type = type;
			const curTab = this.tabs.find(tab => {
				return tab.value == type;
			});
			if (!curTab.loaded) {
				this.loadData();
			}

		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleSelect(selects, row) {
			this.selectedProducts.push(row);


		},
		handleSelectCancel(selects, row) {
			const index = this.selectedProducts.findIndex(pro => pro.product_id == row.product_id);
			this.selectedProducts.splice(index, 1);
		},
		getInitSelected() {
			const selected = [];
			this.selected.forEach(pro => {
				if (pro.parent_product_id) {
					const parentProduct = selected.find(p => p.product_id == pro.parent_product_id);
					if (!parentProduct) {
						selected.push({ 
							product_id: pro.parent_product_id, 
							product_name: pro.parent_product_name,
							child_products: [{ product_id: pro.product_id, product_name: pro.product_name }]
							
						});
					} else {
						parentProduct.child_products.push({ product_id: pro.product_id, product_name: pro.product_name });
					}
				} else if (!selected.find(p => p.product_id == pro.product_id)) {
					selected.push({ product_id: pro.product_id, product_name: pro.product_name });
				}
			});
			return selected;
		},
		getExpandSelects() {
			const selects = [];
			this.selectedProducts.forEach(pro => {
				if (pro.child_products && pro.child_products.length > 0) {
					pro.child_products.forEach(p => {
						selects.push({ ...p, parent_product_name: pro.product_name, parent_product_id: pro.product_id });
					});
				} else {
					selects.push(pro);
				}
			});
			return selects;
			

		},
		handleRowClick(row, index, tabIndex) {
			this.$refs.table[tabIndex].toggleSelect(index);
		},

	}
};
export const ChooseProduct = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" >
.v-sale-choose-product {
	.ivu-modal-body {
		padding-bottom: 0;
	}
	.ivu-table {
		.ivu-table-header {
			.ivu-checkbox-wrapper {
				display: none;
			}
		}
		
	}
	.ivu-tabs {
		&._tabs-no-bar .ivu-tabs-bar {
			display: none
		}

	}
	

}

</style>

