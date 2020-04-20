<template>
	<i-modal 
		ref="modal" 
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		class="v-sc-manage-inspection-grade-modal"
		width="900px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			关联产品
		</div>

		<div class="g-m-b-20">
			<i-select
				v-model="search.product_ids"
				style="width: 220px;"
				class="g-m-r-5"
				clearable
				transfer
				filterable
				multiple
				transfer-class-name="v-sc-manage-indpection-grade-select"
				placeholder="请选择下单产品"
				@on-change="handleSearch"
			>
				<!--防止空格产生BUG-->
				<i-option 
					v-for="item in productList" 
					:value="item.product_id" 
					:key="item.product_id"
				>{{ item.product_name }}</i-option>
			</i-select>

			<i-select
				v-model="search.category_id"
				clearable
				transfer
				style="width:220px;"
				placeholder="产品分类"
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<i-option
					v-for="item in productClass"
					:value="item.category_id"
					:key="item.category_id"
				>
					{{ item.category_name }}
				</i-option>
			</i-select>

			<i-select
				v-model="search.search_service_score_id"
				clearable
				transfer
				style="width:220px;"
				placeholder="关联打分项"
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<i-option
					v-for="item in scoreList"
					:value="item.id"
					:key="item.id"
				>
					{{ item.name }}
				</i-option>
			</i-select>

			<i-button type="primary" @click="handleSearch">
				搜索
			</i-button>
		</div>

		<i-tabs
			value="0"
			type="card"
			class="g-tabs-card"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane :label="'产品列表 ' + noDeleteCount" name="0">
				<oa-product key="1" ref="product" :list="product.list"/>
			</i-tab-pane>
			<i-tab-pane :label="'回收站 ' + yesDeleteCount" name="1">
				<oa-product key="2" ref="recycle" :list="recycle.list"/>
			</i-tab-pane>
		</i-tabs>
	</i-modal>
</template>

<script>
import { Modal, Select, Option, Button, Tabs, TabPane } from "iview";
import { CreatePortal } from "wya-vc";
import lodash from "lodash";
import Product from "./product";

export default {
	name: "sc-manage-inspection-grade-modal",

	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-product": Product
	},

	props: {
		service_score_id: Number
	},
    
	data() {
		return {
			visible: false,
			tabs: "0",
			productList: [], // 下拉产品列表
			productClass: [], // 产品分类
			scoreList: [], // 关联打分项列表
			search: {
				product_ids: [],
				search_service_score_id: null,
				category_id: null
			},
			product: {
				list: []
			}, // 产品列表
			recycle: {
				list: []
			}, // 回收站
			noDeleteCount: 0,
			yesDeleteCount: 0
		};
	},
    
	mounted() {
		this.loadProductData();
		this.loadProductClassData();
		this.loadScoreData();
		this.loadData(0);
		this.loadData(1);
		this.visible = true;
	},
    
	methods: {
		// 下单产品贵
		loadProductData() {
			this.$request({
				url: '_SC_MANAGE_INSPECTION_QUALITY_PRODUCT_GET',
				type: "GET",
				param: {
					is_all: 1
				}
			}).then(res => {
				res.data.forEach(item => {
					this.productList.push({
						product_id: item.product_id,
						product_name: item.product_name
					});
				});
			}).catch((error) => {
			});
		},

		loadProductClassData() {
			this.$request({
				url: '_SALE_SALE_PRODUCT_CATEGORY_LIST_GET',
				type: "GET",
				param: {}
			}).then(res => {
				res.data.forEach(item => {
					this.productClass.push({
						category_id: item.category_id,
						category_name: item.category_name
					});
				});
			}).catch((error) => {
			});
		},

		loadScoreData() {
			this.$request({
				url: '_SC_SERVICE_MANAGE_GRADE_SCORE_LIST_GET',
				type: "GET",
				param: {}
			}).then(res => {
				this.scoreList = res.data;
			}).catch((error) => {
			});
		},

		loadData(type) {
			this.$request({
				url: '_SC_SERVICE_MANAGE_GRADE_PRODUCT_LIST_GET',
				type: "GET",
				param: {
					service_score_id: this.service_score_id,
					type,
					...this.search,
					product_ids: this.search.product_ids.join(",")
				}
			}).then(res => {
				if (type === 0) {
					this.product = res.data;
				} else {
					this.recycle = res.data;
				}

				this.noDeleteCount = res.data.no_delete_count;
				this.yesDeleteCount = res.data.yes_delete_count;
			}).catch((error) => {
			});
		},

		handleSearch: lodash.debounce(function () {
			this.loadData(0);
			this.loadData(1);
		}, 300),
        
		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		},
        
		handleOk() {
			let product_ids = [...this.$refs.product.productIds, ...this.$refs.recycle.productIds];
			
			this.$request({
				url: '_SC_SERVICE_MANAGE_GRADE_SET_PRODUCTS_POST',
				type: "POST",
				param: {
					service_score_id: this.service_score_id,
					product_ids: product_ids.join(",")
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		},

		handleCancel() {
			this.$emit("close");
			this.visible = false;
		}
	}
};

export const RelationProduct = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-manage-indpection-grade-select{
	max-width: 220px !important;
}

.v-sc-manage-inspection-grade-modal{
	.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar {
		div:nth-of-type(2){
			border-radius: 4px 0 0 0;
		}

		div:nth-of-type(3){
			border-radius: 0 4px 0 0;
		}
	}
}
</style>