<template>
	<div>
		<i-radio-group v-if="chartType!=4" v-model="type" type="button">
			<i-radio :label="1" style="font-size:14px" >成交客户</i-radio>
			<i-radio :label="2" style="font-size:14px">成交金额</i-radio>
		</i-radio-group>
		<div v-else style="height:32px"/>
		<div style="height:250px">
			<vc-echarts 
				ref="chart"
				:options="chartOption"
				:auto-resize="true"
			/>
		</div>
	</div>
</template>
<script>
import { Input, Button, Radio, RadioGroup } from 'iview';
import { Echarts } from "wya-vc";
import moment from 'moment';

const chartTypeMap = {
	1: {
		queryKey: 'industry_id',
		link: '/statistic/business/customer/deal/industry',
				
	},
	2: {
		queryKey: 'area',
		link: '/statistic/business/customer/deal/area'
	},
	3: {
		queryKey: 'customer_type',
		link: '/statistic/business/customer/deal/type'
	},
	4: {
		queryKey: 'discount',
		link: '/statistic/business/customer/deal/discount'
	},

};
export default {
	name: 'oa-statistic-pie-chart',
	components: {
		'i-input': Input,
		'i-button': Button,
		"vc-echarts": Echarts,
		'i-radio': Radio,
		'i-radio-group': RadioGroup

	},
	props: {
		data: {
			type: Object,
			default: () => ({
				1: {
					legendData: ['暂无数据'],
					seriesData: [{ name: "暂无数据", value: 0 }]
				},
				2: {
					legendData: ['暂无数据'],
					seriesData: [{ name: "暂无数据", value: 0 }]
				}
			})
		},
		title: String,
		chartType: [String, Number],
		// time: Object,
		// tab: [Number, String]

	},
	data() {
		// let color1 = ["#398EEB", "#5DBAD3", "#5EB25D", "#E74854", "#EBB356", "#BDD064"];
		let color = ["#398EEB", "#5DBAD3", "#5EB25D", "#EBB356", "#EA6F57", "#E74854", "#BDD064"];
		return {
			type: 1,
			chartOption: {
				 title: {
					text: this.title,
					left: '26%',
					top: '5%',
					textStyle: {
						fontWeight: 400
					}
					
				},
				tooltip: {
					trigger: 'item',
					formatter: "{b}：{c}  ({d}%)"
				},
				legend: {
					orient: 'vertical',
					left: '70%',
					data: [],
					top: "middle", // 图例垂直居中
					icon: 'circle'
				},
				series: [
					{
						name: this.name,
						type: "pie", // 饼图
						radius: ["50%", "65%"], // 内外圆半径
						center: ["35%", "55%"], // 饼图中心坐标
						color,
						avoidLabelOverlap: false, // 是否开启防止标签重叠
						label: {
							show: false,
							position: "center",
							color: '#4B4F57',
							fontSize: 16,
							fontWeight: 400,
							fontFamily: 'MicrosoftYaHei',
							formatter: (param) => {
								return this.name;
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: []
					}
				]
			},

		};
	},
	watch: {
		data(val) {
			this.updateChartData();
		},
		type(val) {
			this.updateChartData();
		}
	},
	created() {
		this.updateChartData();

	},

	mounted() {
		setTimeout(() => {
			this.$refs.chart.chart.on('click', this.handleClick);
		}, 1000);
		
	},
	methods: {
		handleClick(params) {
			const option = chartTypeMap[this.chartType];
			this.$emit('click-pie', { param: { [option.queryKey]: params.data.id + '' }, path: option.link });
		},
		updateChartData() {
			const data = this.data[this.type];
			this.chartOption.legend.data = data.legendData;
			this.chartOption.series[0].data = data.seriesData;
		}
	}
};
</script>
<style lang="scss">
</style>