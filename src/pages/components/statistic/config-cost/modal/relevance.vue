<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="680"
		:loading="true"
		:mask-closable="false"
		title="关联"
		class="v-statistic-config-cost-relevance"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div 
			v-if="choiceList.length > 0" 
			class="g-flex _header"
			style="margin-bottom: 40px;"
		>
			<div 
				class="g-c-000"
				style="width: 70px;"
			>
				已选择：
			</div>
			<div class="g-flex g-fw-w" style="width: 90%;">
				<div 
					v-for="(item,index) in choiceList"
					:key="index"
					:class="index === 0 ? '__first-block' : 'g-c-white __other-block'"
					class="g-pd-lr-10 g-m-r-10 g-flex g-flex-ac g-m-b-10 __block"
				>
					<span class="g-m-r-5">{{ item.product_name }}</span>
					<i 
						v-if="index != 0" 
						class="iconfont icon-close2 g-pointer"
						@click="handleCancleSelect(item,index)"
					/>
				</div>
			</div>
		</div>

		<div>
			<i-input
				v-model="search.keyword"
				clearable
				class="g-m-r-10"
				style="width:220px;"
				placeholder="请输入产品名称"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>

			<i-select
				v-model="search.category_id"
				clearable
				transfer
				class="g-m-r-10"
				style="width:220px"
				placeholder="选择产品分类"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item,index) in list"
					:key="index"
					:value="String(item.category_id)"
				> 
					{{ item.category_name }} 
				</i-option>
			</i-select>

			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>

		<i-table
			:columns="columns"
			:data="tableList"
			class="g-m-t-20"
			@on-select="handleSelect"
			@on-select-cancel="handleSelectCancel"
		/>
	</i-modal>
</template>

<script>
import { Modal, Input, Select, Option, Table, Button } from "iview";
import { CreatePortal } from "wya-vc";

export default {
	name: 'v-statistic-config-cost-relevance-modal',
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-table": Table
	},
	props: {
		productId: {
			type: Number
		}
	},
	data() {
		return {
			visible: false,
			list: [],
			choiceList: [],
			productList: [],
			tableList: [],
			search: {
				keyword: '',
				category_id: ''
			},
			columns: [
				{
					type: 'selection',
					width: 60
				},
				{
					title: '产品名称',
					key: 'product_name',
					minWidth: 200
				},
				{
					title: '产品类型',
					key: 'category_name',
					minWidth: 200
				}
			]
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	created() {
		this.loadClass();
		this.loadProductList();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadClass() {
			this.$request({
				url: "_CONTENT_PRODUCT_CATEGORY_GET",
				type: "GET",
				loading: false
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadProductList() {
			this.productList = [];
			this.choiceList = [];
            
			this.$request({
				url: "_STATISTIC_CONFIG_COST_PRODUCT_LIST_GET",
				type: "GET",
				loading: false,
				param: {
					product_id: this.productId,
					...this.search
				}
			}).then(res => {
				this.choiceList = res.data.choice_list.filter(item => item.product_id === this.productId);
				let index = res.data.choice_list.findIndex(item => item.product_id === this.productId);
				res.data.choice_list.forEach((item, i) => {
					i != index && this.choiceList.push(item);
				});
				let productIndex = res.data.lists.findIndex(item => item.product_id === this.productId);
				res.data.lists.forEach((item, i) => {
					this.productList.push({
						...item,
						_checked: !!item.select,
						_disabled: productIndex === i
					}); 
				});
				this.tableList = this.productList;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch() {
			const { keyword, category_id } = this.search;
			let tableList = this.productList;
            
			if (category_id) {
				tableList = tableList.filter(it => it.category_id == category_id);
			}

			if (keyword) {
				tableList = tableList.filter(it => it.product_name.includes(keyword));

			}
            
			this.tableList = tableList;
		},
		handleCancel() {
			this.$emit("close");
		},
		handleOk() {
			let relationIds = this.choiceList.map(item => item.product_id);

			this.$request({
				url: '_STATISTIC_CONFIG_COST_RELATION_POST',
				type: "POST",
				param: {
					product_id: this.productId,
					relation_ids: relationIds
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancleSelect(item, index) {
			let productId = item.product_id;
			let productIndex = this.productList.findIndex(element => element.product_id === productId);
			this.productList[productIndex]._checked = false;
			this.choiceList.splice(index, 1);
		},
		handleSelect(selection, row) {
			let productId = row.product_id;
			let productIndex = this.productList.findIndex(element => element.product_id === productId);
			this.productList[productIndex]._checked = true;
			this.choiceList.push(row);
		},
		handleSelectCancel(selection, row) {
			let productId = row.product_id;
			let productIndex = this.productList.findIndex(element => element.product_id === productId);
			let choiceIndex = this.choiceList.findIndex(element => element.product_id === productId);
			this.productList[productIndex]._checked = false;
			this.choiceList.splice(choiceIndex, 1);
		}
	}
};

export const RelevanceModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-statistic-config-cost-relevance {
    ._header {
        max-height: 180px;
        overflow-y: auto;

        .__block {
            height: 24px;
            line-height: 24px;
            border-radius: 3px;
        }

        .__first-block {
            background: #f0f4fc;
        }

        .__other-block {
            background: #E84C57;
        }
    }

    .ivu-table-wrapper {
		border: 0px;
		max-height: 251px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.ivu-table-overflowX {
		overflow-x: hidden;
	}

	.ivu-table {
		th,
		td {
			border: none;
		}
	}

	.ivu-table:after {
		width: 0;
	}

	.ivu-table:before {
		height: 0;
	}

	.ivu-table {
		th:nth-of-type(1) {
			.ivu-checkbox-wrapper {
				display: none;
			}
		}
	}
}
</style>