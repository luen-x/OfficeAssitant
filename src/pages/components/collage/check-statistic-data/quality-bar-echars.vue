<template>
	<div style=" height: 350px;margin-top: 54px;">
		<vc-echarts 
			:options="bar"
			:auto-resize="true"
		/>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	name: "collage-quality-bar-echars", 

	components: {
		"vc-echarts": Echarts
	},

	props: {
		quality_num_static: Array
	},
    
	data() {
		return {
			bar: {
				color: ['#2E9DFA', '#5DCA4D'],
				tooltip: {
					trigger: 'axis',
					formatter(v) {
						let a = v[0].seriesName.split(",");
						let b = v[1].seriesName.split(",");

						return v[0].name + "<br/>" 
						+ v[0].marker + a[0] + " | " + v[0].data + "<br/>" 
						+ v[1].marker + b[0] + " | " + v[1].data;
					}
				},
				legend: {
					data: [{
						name: '',
						// 强制设置图形为圆。
						icon: 'circle',	
					},
					{
						name: '',
						// 强制设置图形为圆。
						icon: 'circle',
					}],
					left: 20,
					formatter(name) {
						let str = name.split(',');
						let arr = [
							`{a|${str[0]}}`,
							'{b||}',
							`{c|${str[1]}}`
						];

						return arr.join(" ");
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "12",
								color: "#333333",
								width: 70
							},
							b: {
								fontSize: "10",
								color: "#DCDCDC"
							},
							c: {
								fontSize: "12",
								color: '#333333',
								width: 60,
								padding: [0, 0, 0, 10]
							}
						}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: [],
					axisTick: { 
						show: false 
					},
					axisLine: {
						lineStyle: {
							color: '#E8E8E8'
						}
					},
					axisLabel: {
						color: '#000000'
					},
				},
				yAxis: {
					type: 'value',
					axisTick: { 
						show: false 
					},
					axisLine: {
						lineStyle: {
							color: '#E8E8E8'
						}
					},
					axisLabel: {
						color: '#000000'
					},
					splitLine: {
						lineStyle: {
							type: 'dashed'
						}
					}
				},
				series: [
					{
						name: '',
						type: 'line',
						data: []
					},
					{
						name: '',
						type: 'line',
						data: []
					}
				]
			}
		};
	},
    
	mounted() {
		let company_num = 0;
		let lesson_num = 0;

		this.quality_num_static.forEach(item => {
			this.bar.xAxis.data.push(item.date);
			this.bar.series[0].data.push(item.company_num);
			this.bar.series[1].data.push(item.lesson_num);
			company_num += item.company_num;
			lesson_num += item.lesson_num;
		});

		this.bar.series[0].name = `质检客户数,${company_num}人`;
		this.bar.series[1].name = `质检套系数,${lesson_num}套`;
		this.bar.legend.data[0].name = `质检客户数,${company_num}人`;
		this.bar.legend.data[1].name = `质检套系数,${lesson_num}套`;
	}
};
</script>

<style lang="scss">
</style>