<template>
	<div>
		<oa-filter @query="handleQuery" />
		<i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane
				label="退款人数"
				name="1"
			>
				<div :style="{ minWidth: '800px',maxWidth:'1200px', height:'300px'}">
					<vc-echarts :options="option1" :auto-resize="true" />
				</div>
			</i-tab-pane>
			<i-tab-pane
				label="退款金额"
				name="2"
			>
				<div :style="{ minWidth: '800px',maxWidth:'1200px', height:'300px'}">
					<vc-echarts :options="option2" :auto-resize="true" />
				</div>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Input, Button, Icon, Select, Option, DatePicker, Cascader, Tabs, TabPane } from 'iview';
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
	name: 'oa-statistic-deal-refund-content',
	components: {
		'i-input': Input,
		'i-select': Select,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'oa-filter': Filter,
		"vc-echarts": Echarts,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane
	},
	data() {
		const self = this;
		const months = [];
		for (let i = 11; i >= 0; i--) {
			months.push(moment().subtract(i, 'months').format('YYYY.MM'));
		}
		return {
			tabs: {
				'1': this.$route.query.type == '1',
				'2': this.$route.query.type == '2'
			},
			type: this.$route.query.type || '1',
			option1: {
				tooltip: {
					// trigger: 'axis',
					// axisPointer: { // 坐标轴指示器，坐标轴触发有效
					// 	type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					// }
				},
				legend: {
					x: 'left',
					left: 30,
					top: 10,
					data: [
						{
							name: '老客户退款人数',
							icon: 'circle',
						},
						{
							name: '新客户退款人数',
							icon: 'circle'
						}
					]
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					data: months,
					axisLine: {
						lineStyle: {
							color: '#ccc'
						}
					},
					axisLabel: {
						color: "#666666",

					},
					axisTick: {
						show: false
					}
				},
				yAxis: {
					axisLine: {
						lineStyle: {
							color: '#ccc'
						}
					},
					axisLabel: {
						color: "#666666",
						padding: [0, 10, 0, 0],
						formatter: '{value}人'
					},
					axisTick: {
						show: false
					}
				},
				series: [
					{
						name: '老客户退款人数',
						type: 'bar',
						stack: '客户',
						barWidth: 32,
						data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						itemStyle: {
							color: colors.blue
						},
					},
					{
						name: '新客户退款人数',
						type: 'bar',
						stack: '客户',
						data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						itemStyle: {
							color: colors.lightBlue
						},
						label: {
							show: true,
							position: 'top',
							color: '#333',
							formatter(params) {
								return self.option1.series[0].data[params.dataIndex]
								+ self.option1.series[1].data[params.dataIndex];
							}
						},
					}
				]
			},
			option2: {
				tooltip: {
					// trigger: 'axis',
					// axisPointer: { // 坐标轴指示器，坐标轴触发有效
					// 	type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					// }
				},
				legend: {
					x: 'left',
					left: 30,
					top: 10,
					data: [
						{
							name: '老客户退款金额',
							icon: 'circle',
						},
						{
							name: '新客户退款金额',
							icon: 'circle'
						}
					]
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
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
					},
				},
				yAxis: {
					axisLine: {
						lineStyle: {
							color: '#ccc'
						}
					},
					axisLabel: {
						color: "#666666",
						formatter: '{value}元',
						padding: [0, 10, 0, 0],
					},
					axisTick: {
						show: false
					},
				},
				series: [
					{
						name: '老客户退款金额',
						type: 'bar',
						stack: '客户',
						barWidth: 32,
						data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						itemStyle: {
							color: colors.blue
						},
					},
					{
						name: '新客户退款金额',
						type: 'bar',
						stack: '客户',
						data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						itemStyle: {
							color: colors.lightBlue
						},
						label: {
							show: true,
							position: 'top',
							color: '#333',
							formatter(params) {
								return self.option2.series[0].data[params.dataIndex]
								+ self.option2.series[1].data[params.dataIndex];
							}
						},

					}
				]

			}
		};
	},
	created() {
	},
	methods: {
		handleQuery(query) {
			const tabs = {
				'1': false,
				'2': false,
			};
			tabs[this.type] = true;
			this.tabs = tabs;
			this.handleSearch(query);
		},
		handleSearch(query) {
			const type = this.type || 1;
			this.$request({
				url: type == 2 ? "_STATISTICS_DEAL_REFUND_MONY_GET" : '_STATISTICS_DEAL_REFUND_COUNT_GET',
				type: "GET",
				param: query,
				loading: false,
			}).then(res => {
				if (type == 1) {
					res.data.old_count = res.data.old_count.map(item => parseFloat(item));
					res.data.new_count = res.data.new_count.map(item => parseFloat(item));
					this['option' + type].series[0].data = res.data.old_count;
					this['option' + type].series[1].data = res.data.new_count;
				} else {
					res.data.old_money = res.data.old_money.map(item => parseFloat(item));
					res.data.new_money = res.data.new_money.map(item => parseFloat(item));
					this['option' + type].series[0].data = res.data.old_money;
					this['option' + type].series[1].data = res.data.new_money;

				}
				this['option' + type].xAxis.data = res.data.month_range.map(item => item.replace('-', '.'));
				this.$forceUpdate();
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
			};
			this.$router.replace(getHashUrl('/statistics/deal/refund', { ...query }));
			if (!this.tabs[type]) {
				this.handleSearch(query);
				this.tabs[type] = true;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
