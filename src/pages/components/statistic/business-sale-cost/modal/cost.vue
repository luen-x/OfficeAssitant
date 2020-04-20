<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="680"
		:loading="true"
		:mask-closable="false"
		:title="productAlias"
		class="v-statistic-business-sale-cost"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-tc">关联产品</div>
		<i-table
			:columns="columns"
			:data="tableList"
			class="g-m-t-20"
		/>
	</i-modal>
</template>

<script>
import { Modal, Table } from "iview";
import { CreatePortal } from "wya-vc";
import { formatNumBatch } from '@utils/utils';

export default {
	name: 'v-statistic-business-sale-cost-modal',
	components: {
		"i-modal": Modal,
		"i-table": Table
	},
	props: {
		productAlias: {
			type: String
		},
		mainProductId: {
			type: [String, Number]
		},
		categoryId: {
			type: [String, Number]
		},
		costDepartId: {
			type: [String, Number]
		},
		params: {
			type: Object
		}
	},
	data() {
		return {
			visible: false,
			tableList: [],
			columns: [
				{
					title: '序号',
					type: 'index',
					minWidth: 100
				},
				{
					title: '产品名称',
					key: 'product_name',
					minWidth: 200
				},
				{
					title: '客户数量',
					key: 'customer_count',
					minWidth: 140
				},
				{
					title: '成本总额',
					key: 'total_amount_show',
					minWidth: 140
				}
			],
			formatConfig: [ 
				{ key: 'customer_count', precision: 0, prefix: '', suffix: '' },
				{ key: 'total_amount_show', precision: 2, prefix: '', suffix: '' }
			]
		};
	},
	created() {
		this.loadProductList();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadProductList() {
			this.$request({
				url: "_STATISTIC_BUSINESS_SALE_COST_PRODUCT_LIST_GET",
				type: "GET",
				param: {
					main_product_id: this.mainProductId,
					category_id: this.categoryId,
					cost_depart_id: this.costDepartId,
					type: this.params.currentTab,
					year: +this.params.currentTab === 2 ? this.params.year : '',
					season: +this.params.currentTab === 3 ? this.params.season : '',
					month: +this.params.currentTab === 4 ? this.params.month : ''
				},
				loading: false,
				initList: (list) => {
					return formatNumBatch(list, this.formatConfig);
				}
			}).then(res => {
				this.tableList = res.data.list;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$emit("close");
		},
		handleOk() {
			this.$emit("sure");
		}
	}
};

export const Cost = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-statistic-business-sale-cost {
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