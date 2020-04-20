
<template>
	<div>
		<div :style="{width: '100%', height: '354px'}">
			<vc-echarts :options="ooption" :auto-resize="true" />
		</div>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	name: "oa-tpl",
	components: {
		"vc-echarts": Echarts
	},
	props: {
		value: null,
		height: String
	},
	data() {
		return {
			ooption: {}, // 籍贯统计图
			color: '',
			colors: ['#eb4310', '#f6941d', '#fbb417', '#cdd541', '#99cc33', '#3f9337', '#219167', '#239676', '#a1488e', '#c71585', '#bd2158'], 
		};
	},
	watch: {
		// 监听数据变化
		value() {
			let month = this.value.month;
			if (this.value.rank && this.value.rank[0] && this.value.rank[0].depart_id) {
				this.value.rank.map(item => this.color = (this.handleColor(item.depart_id)));
			}
			// 籍贯统计图
			 this.ooption = {
				   tooltip: {
					trigger: 'axis'
				},
				legend: {
					orient: "vertical",
					top: "middle",
					right: "3%",
					containLabel: true,
				},
				
				color: this.color || this.colors,
				grid: {
					left: "3%",
					right: "10%",
					bottom: "5%",
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: month,
					boundaryGap: false,
					axisLine: { onZero: false }
				},
				yAxis: {
					type: "value",
					inverse: true,
					minInterval: 1,
					axisLabel: {
						formatter(v) {
							return v;
						}
					}
				},
				series: this.value.rank && this.value.rank.map((item, index) => {
					return 	{
						name: item.depart_name,
						type: 'line',
						data: item.rank,
						itemStyle: {  
							normal: {    
								lineStyle: {    
									color: this.color || this.colors[index++]
								}    
							}  
						},  
					};
				})
			};
			if (this.color && this.color.length) {
				this.ooption.color = this.color; 
			}
		}
	},
	created() {

	},
	methods: {
		handleColor(name) {
			let newColor = '';
			switch (String(name)) {
				case '21':
					newColor = '#FA61C9';
					break;
				case '22':
					newColor = '#E84C57';
					break;
				case '23':
					newColor = '#8FA4FF';
					break;
				case '24':
					newColor = '#4CD4E8';
					break;
				case '29':
					newColor = '#4CE8A0';
					break;
				case '30':
					newColor = '#FFD940';
					break;
				case '54':
					newColor = '#2397F9';
					break;
				case '55':
					newColor = '#D200FF';
					break;
				case '56':
					newColor = '#2923A6';
					break;
				case '57':
					newColor = '#ED8F4A';
					break;
				case '58':
					newColor = '#FFB2AE';
					break;
				case '12':
					newColor = '#FF0000';
					break;
				default:
					newColor = '#0000FF';
					break;
			}
			return newColor;
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
