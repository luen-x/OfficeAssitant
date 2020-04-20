<template>
	<vc-echarts 
		:options="options"
		auto-resize
		style="height: 400px;"
	/>
</template>

<script>
import { Echarts } from "wya-vc";
import { getFormatNum } from '@utils/utils';

export default {
	components: {
		'vc-echarts': Echarts
	},
	props: {
		dataSource: {
			type: Object
		}
	},
	data() {
		return {
			options: {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					},
					formatter(data) {
						let name = data[0].name;
						let customerCount = '';
						let totalamount = '';

						data.forEach(item => {
							if (item.componentIndex === 0) {
								customerCount = '客户数量：' + item.data + '个';
							} else if (item.componentIndex === 1) {
								totalamount = '成本总额：' + item.data + '元';
							}
						});

						return name + '<br/>' + (customerCount ? customerCount + '<br/>' : '') + totalamount;
					}
				},
				legend: {
					data: [
						{
							name: '',
							icon: 'roundRect'
						},
						{
							name: '',
							icon: 'roundRect'
						}
					],
					left: 0,
					itemWidth: 14,
					itemHeight: 14,
					itemGap: 60,
					borderRadius: 4,
					formatter: (value) => {
						let list = value.split("|");
						let arr = [];

						arr = [
							`{a|${list[0]}}`,
							`{b||}`,
							`{a|${list[1]}}`
						];

						return arr.join(' ');
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "12",
								color: "#333333"
							},
							b: {
								fontSize: "12",
								color: "#bbb",
								padding: [0, 4, 0, 4]
							},
							c: {
								fontSize: "12",
								color: "#333333"
							}
						}
					}
				},
				grid: {
					x: '4%', // 相当于距离左边效果:padding-left
					y: '20%', // 相当于距离上边效果:padding-top
					// containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						axisPointer: {
							type: 'shadow'
						},
						axisTick: { // x轴刻度线
							show: false
						},
						axisLine: { // x轴
							show: false
						},
						data: []
					}
				],
				yAxis: [
					{
						type: 'value',
						name: '客户数量（个）',
						minInterval: 1,
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},
						axisTick: { // y轴刻度线
							show: false
						},
						axisLine: { // y轴
							show: false
						}
					},
					{
						type: 'value',
						name: '成本总额（万）',
						min: 0,
						position: 'right',
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},
						axisTick: { // y轴刻度线
							show: false
						},
						axisLine: { // y轴
							show: false
						},
						axisLabel: {
							formatter(value) {
								return value / 10000;
							} 
						}
					}
				],
				series: [
					{
						name: '',
						type: 'bar',
						barWidth: '10',
						data: [],
						itemStyle: {
							color: "#55ACEE"
						}
					},
					{
						name: '',
						type: 'bar',
						barWidth: '10',
						yAxisIndex: 1,
						data: [],
						itemStyle: {
							color: "#4CDFC0"
						}
					}
				]
			}
		};
	},
	watch: {
		dataSource(value) {
			this.handleData(value);
		}
	},
	mounted() {
		this.dataSource.list && this.handleData(this.dataSource);
	},
	methods: {
		handleData(value) {
			this.options.xAxis[0].data = [];
			this.options.series[0].data = [];
			this.options.series[1].data = [];

			value.list.forEach(item => {
				this.options.xAxis[0].data.push(item.depart_name);
				this.options.series[0].data.push(item.customer_count);
				this.options.series[1].data.push(item.total_amount);
			});

			this.options.series[0].name = `客户数量 | ${getFormatNum(value.customer_count, 0)}个`;
			this.options.series[1].name = `成本总额 | ${getFormatNum(value.total_amount, 2, '￥')}`;
			this.options.legend.data[0].name = this.options.series[0].name;
			this.options.legend.data[1].name = this.options.series[1].name;
		}
	}
};
</script>