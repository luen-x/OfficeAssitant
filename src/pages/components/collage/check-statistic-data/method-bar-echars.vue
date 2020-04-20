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

let that = this;

export default {
	name: "collage-method-bar-echars", 

	components: {
		"vc-echarts": Echarts
	},

	props: {
		date_quality_type_static: Array,
		total_data: Array
	},
    
	data() {
		let _this = this;

		return {
			bar: {
				color: ['#682EFA', '#FFB42B', '#2E9DFA', '#E8DC46', '#EC505B'],
			    tooltip: {
					trigger: 'axis',
					formatter(v) {
						let quality_type_info = _this.date_quality_type_static[v[0].dataIndex].quality_type_info;
			
						return v[0].name + "<br/>" 
						+ v[0].marker + v[0].seriesName.split("|")[0].split(" ")[0] + quality_type_info[0].point + "% | " + v[0].data + "次<br/>" 
						+ v[1].marker + v[1].seriesName.split("|")[0].split(" ")[0] + quality_type_info[1].point + "% | " + v[1].data + "次<br/>" 
						+ v[2].marker + v[2].seriesName.split("|")[0].split(" ")[0] + quality_type_info[2].point + "% | " + v[2].data + "次<br/>" 
						+ v[3].marker + v[3].seriesName.split("|")[0].split(" ")[0] + quality_type_info[3].point + "% | " + v[3].data + "次<br/>" 
						+ v[4].marker + v[4].seriesName.split("|")[0].split(" ")[0] + quality_type_info[4].point + "% | " + v[4].data + "次";
					}
				},
				legend: {
					orient: 'vertical',
					x: 'left',
					left: '80%',
					top: 80,
					data: [{
						name: '',
						// 强制设置图形为圆。
						icon: 'circle',
					}, {
						name: '',
						// 强制设置图形为圆。
						icon: 'circle',	
					},
					{
						name: '',
						// 强制设置图形为圆。
						icon: 'circle',
					},
					{
						name: '',
						// 强制设置图形为圆。
						icon: 'circle',	
					},
					{
						name: '',
						// 强制设置图形为圆。
						icon: 'circle',
					}],
					formatter(name) {
						let str = name.split(' ');
						let arr = [
							`{a|${str[0]}}`,
							`{b|${str[2]}}`,
							`{c|${str[3]}}`,
							`{d|${str[1]}}`
						];

						return arr.join(" ");
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "12",
								color: "#333333",
								width: 80
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
							},
							d: {
								fontSize: "10",
								color: "#818794"
							}
						}
					}
				},
				grid: {
					left: 50,
					top: 40,
					width: '70%'
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
					},
					{
						name: '',
						type: 'line',
						data: []
					},
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
		this.date_quality_type_static.forEach((item, index) => {
			this.bar.xAxis.data.push(item.date);
		
			item.quality_type_info.forEach(element => {
				this.bar.series[element.quality_type - 1].data.push(element.num);
			});
		});

		this.total_data.forEach((item, index) => {
			this.bar.series[index].name = ["电话质检", "微信质检", "QQ质检", "短信质检", "其他"][item.quality_type - 1] 
				+ ` ${item.point}% | ${item.num}次`;

			this.bar.legend.data[index].name = ["电话质检", "微信质检", "QQ质检", "短信质检", "其他"][item.quality_type - 1] 
				+ ` ${item.point}% | ${item.num}次`;
		});
	}
};
</script>

<style lang="scss">
</style>