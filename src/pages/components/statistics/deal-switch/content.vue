<template>
	<div class="v-statistic-deal-switch g-pd-20">
		<oa-filter @query="handleSearch" />
		<div :style="{minWidth: '800px',maxWidth:'1400px', height:'300px'}">
			<vc-echarts :options="echartOption" :auto-resize="true" />
		</div>
	</div>
</template>

<script>
import { Input, Button, Icon, Select, Option, DatePicker, Cascader } from 'iview';
import { debounce } from 'lodash';
import { Echarts } from "wya-vc";
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/sale';
import Filter from './filter';

const colors = {
	blue: '#2397f9',
	lightBlue: '#58b0fa',
	green: '#5dca4d',
	red: '#ec5058',
	yellow: '#e8dc46',
	orange: '#ffb42b',
	purple: '#be71ff',
	pink: '#ff7eb5'
};
export default {
	name: 'oa-statistic-deal-switch-content',
	components: {
		'i-input': Input,
		'i-select': Select,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'oa-filter': Filter,
		"vc-echarts": Echarts,
	},
	data() {
		const months = [];
		for (let i = 5; i >= 0; i--) {
			months.push(moment().subtract(i, 'months').format('YYYY.MM'));
		}
		return {
			echartOption: {
				tooltip: {
					// trigger: 'axis',
					// axisPointer: { // 坐标轴指示器，坐标轴触发有效
					// 	type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					// }
				},
				legend: {
					orient: 'vertical',
					x: 'left',
					left: '86%',
					top: 40,
					textStyle: {
						padding: [8, 0]
					},
					data: [{
						name: '转手0次',
						// 强制设置图形为圆。
						icon: 'circle',
							
					},
					{
						name: '转手1次',
						// 强制设置图形为圆。
						icon: 'circle',
					},
					{
						name: '转手2次',
						// 强制设置图形为圆。
						icon: 'circle',
					},
					{
						name: '转手3次',
						// 强制设置图形为圆。
						icon: 'circle',
					},
					{
						name: '转手4次及以上',
						// 强制设置图形为圆。
						icon: 'circle',
					}
					]
				},
					
				xAxis: {
					data: months,
					axisLine: {
						lineStyle: {
							color: '#ccc'
						}
					},
					axisLabel: {
						color: "#666666"
					},
					axisTick: {
						show: false
					}
				},
				yAxis: { 
					axisLine: {
						show: false 
					},
					axisLabel: {
						padding: [0, 10, 0, 0],
						color: "#666666",
					},
					splitLine: {
						lineStyle: {
							type: 'dashed',
							color: '#ccc'
						}
					},
					axisTick: {
						show: false
					}
				},
				series: [
					{
						name: '转手0次',
						type: 'bar',
						barWidth: 8,
						barGap: "62.5%",
						data: [0, 0, 0, 0, 0, 0],
						itemStyle: {
							color: colors.blue
						}
					}, 
					{
						name: '转手1次',
						type: 'bar',
						barWidth: 8,
						data: [0, 0, 0, 0, 0, 0],
						itemStyle: {
							color: colors.green
						}
					}, 
					{
						name: '转手2次',
						type: 'bar',
						barWidth: 8,
						data: [0, 0, 0, 0, 0, 0],
						itemStyle: {
							color: colors.yellow
						}
					}, 
					{
						name: '转手3次',
						type: 'bar',
						barWidth: 8,
						data: [0, 0, 0, 0, 0, 0],
						itemStyle: {
							color: colors.red
						}
					}, 
					{
						name: '转手4次及以上',
						type: 'bar',
						barWidth: 8,
						data: [0, 0, 0, 0, 0, 0],
						itemStyle: {
							color: colors.orange
						}
					}
				],
				grid: {
					left: 50,
					top: 40,
					width: '75%'
				}
			}
		};
	},
	methods: {
		handleSearch(query) {
			this.$request({
				url: "_STATISTICS_DEAL_SWITCH_GET",
				type: "GET",
				param: query,
				loading: false,
			}).then(res => {
				if (Array.isArray(res.data)) {
					const months = [];
					for (let i = 5; i >= 0; i--) {
						months.push(moment(query.end_time).subtract(i, 'months').format('YYYY.MM'));
					}
					res.data = {
						month: months,
						info: [
							[0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0]
						]
					};
				}
				this.echartOption.series.forEach((item, index) => {
					item.data = res.data.info[index];
				});
				this.echartOption.xAxis.data = res.data.month.map(item => item.replace('-', '.'));
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
			
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
