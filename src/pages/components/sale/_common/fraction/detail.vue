<template>
	<div class="v-sale-fraction-detail">
		<i-table :columns="columns" :data="detail"/>
	</div>
</template>

<script>
import { Table } from 'iview';

export default {
	name: 'oa-fraction-detail',
	components: {
		'i-table': Table
	},
	props: {
		fractionType: String,
		detail: Array
	},
	data() {
		return {
			columns: [
				{
					title: `${this.fractionType.split('详情')[0]}类型`,
					key: 'type_name',
					minWidth: 120,
					tooltip: true
				},
				{
					title: '1月',
					key: 'jan',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '2月',
					key: 'feb',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '3月',
					key: 'mar',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '4月',
					key: 'apr',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '5月',
					key: 'may',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '6月',
					key: 'jun',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '7月',
					key: 'jul',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '8月',
					key: 'aug',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '9月',
					key: 'sep',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '10月',
					key: 'oct',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '11月',
					key: 'nov',
					minWidth: 60,
					tooltip: true
				},
				{
					title: '12月',
					key: 'dec',
					minWidth: 60,
					tooltip: true
				}
			]
		};
	}
};

export const FractionDetail = module.exports.default;
</script>

<style lang="scss">
.v-sale-fraction-detail {
	border-left: 1px solid #dcdee2;
	.ivu-table-wrapper {
		border: none;
	}
	.ivu-table th {
		background-color: #fff!important;
	}
}
</style>
