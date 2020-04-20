<template>
	<div class="v-sc-service-manage-grade-product">
		<i-table
			ref="table"
			:columns="columns"
			:data="tableData"
			:border="false"
			stripe
			@on-select="handleSelect"
			@on-select-cancel="handleSelectCancel"
			@on-row-click="handleRowClick"
		/>
	</div>
</template>

<script>
import { Table } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	name: "sc-service-manage-grade-product",
    
	components: {
		"i-table": Table
	},

	props: {
		list: Array
	},

	data() {
		return {
			columns: [
				{
					type: 'selection',
					align: 'center',
					minWidth: 50,
					fixed: "left"
				},
				{
					title: "产品名称",
					key: "product_name",
					minWidth: 120,
					fixed: "left",
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.product_name}
								width="120px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "产品分类",
					key: "category_name",
					minWidth: 100
				},
				{
					title: "制作部门",
					key: "make_depart_name",
					minWidth: 100
				},
				{
					title: "关联打分项",
					key: "service_score_items",
					minWidth: 160,
					render: (h, params) => {
						let score = params.row.service_score_items.join("、");

						if (score) {
							return (
								<AutoToolTip 
									content={score}
									width="160px"
									theme="dark"
									placement="bottom" 
									labelClass=" "
								/>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				}
			],
			tableData: [],
			productIds: []
		};
	},

	watch: {
		list(v) {
			v.forEach(item => {
				if (item.sort > 0) {
					item._checked = true;
					this.productIds.push(+item.product_id);
				} else {
					item._checked = false;
				}
			});

			this.tableData = JSON.parse(JSON.stringify(v));
		}
	},
    
	methods: {
		handleRowClick(row, index) {
			this.$refs.table.toggleSelect(index);
		},

		handleSelect(selection, row) {
			let arr = [];
			let hash = {};

			// 设置被选中的_checked值
			this.handleSetChecked(true, row);

			selection.forEach(item => {
				arr.push(+item.product_id);
			});

			this.productIds = [...this.productIds, ...arr];

			this.productIds.forEach(item => {
				if (!hash[item]) {
					hash[item] = item;
				}
			});

			this.productIds = Array.from(Object.keys(hash));
		},

		handleSelectCancel(selection, row) {
			let arr = [];

			// 取消被选中的_checked值
			this.handleSetChecked(false, row);

			this.productIds.forEach(elemment => {
				if (+row.product_id != elemment) {
					arr.push(elemment);
				}
			});

			this.productIds = [...arr];
		},

		handleSetChecked(bool, row) {
			for (let item of this.tableData) {
				if (+item.product_id == +row.product_id) {
					item._checked = bool;
					break;
				}
			}
		},
	}
};
</script>

<style lang="scss">
.v-sc-service-manage-grade-product{
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