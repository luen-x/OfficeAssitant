<template>
	<div class="v-statistic-business-sale-product-table">
		<i-table
			:columns="columns"
			:data="tableData"
			stripe
		/>
	</div>
</template>

<script>
import { Table } from 'iview';
import { getFormatNum } from '@utils/utils';

export default {
	components: {
		'i-table': Table
	},
	props: {
		dataSource: {
			type: Object
		}
	},
	data() {
		return {
			columns: [
				{
					title: '部门名称',
					key: 'depart_name',
					minWidth: 150
				},
				{
					title: '客户数量（个）',
					key: 'customer_count',
					minWidth: 150
				},
				{
					title: '成本总额(元)',
					key: 'total_amount',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>{getFormatNum(row.total_amount, 2)}</div>
						);
					}
				}
			],
			tableData: []
		};
	},
	watch: {
		dataSource(value) {
			this.tableData = value.list;
		}
	},
	mounted() {
		this.tableData = this.dataSource.list;
	}
};
</script>

<style lang="scss">
.v-statistic-business-sale-product-table{
    .ivu-table th {
		font-weight: normal;
	}

	.ivu-poptip-rel{
		display: inline;
	}

    .ivu-table-wrapper {
		border: none;
	}

	.ivu-table {
		th,td {
			border: none;
		}
	}

	.ivu-table:after {
		width: 0;
	}

	.ivu-table:before {
		height: 0;
	}
}
</style>