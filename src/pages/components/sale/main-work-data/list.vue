<template>
	<div class="v-sale-main-work-data-list g-m-t-20">
		<div
			:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
			class="g-relative"
		>
			<vc-echarts :options="chart.option" :auto-resize="true"/>
			<i 
				:class="chart.chartType=='line'?'icon-histogram':'icon-qushitu'" 
				class="icon iconfont  g-c-blue-mid g-pointer g-fs-16 g-absolute"
				style="right:96px;top:0"
				@click="handleChangeChartType"
			/>
		</div>
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			mode="table"
			style="margin-bottom:80px"
			class="g-m-t-20"
			@page-size-change="handleChangePageSize"
		/>

	</div>
</template>

<script>
import { Paging, Echarts } from 'wya-vc';
import { Button } from 'iview';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils'; 
import item from './item';
import { setData } from '../_common/util';

const defCallData = {
	"count_all": 0, // 拨号数量
	"connect_count": 0, // 接通数量
	"total_last_time": "00:00:00", // 总通话时长
	"avg_last_time": "00:00:00", // 平均通话时长
	"connect_rate": "0%", // 接通率
	"max_call_time_str": "00:00:00"// 最长通话时长
};
export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'vc-echarts': Echarts,
		'i-button': Button
	},
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
			maxCallTime: 0,
			chart: {
				label: '客户资料统计',
				legend1: '添加客户',
				legend2: '领取客户',
				chartType: 'line',
				labelList: [
					{ label: '添加客户', value: 0 },
					{ label: '领取客户', value: 0 },
					{ label: '拨号数量', value: 0 },
					{ label: '接通数量', value: 0 }
				],
				option: {
					legend: {
						textStyle: {
							color: '#666'
						},
						formatter: (name) => {
							return name + ' | ' + this.chart.labelList.find(it => it.label == name).value;
						},
						itemGap: 20,
						data: [{
							name: "添加客户",
							icon: 'circle',
						},
						{
							originName: '领取客户',
							name: "领取客户",
							icon: 'circle',
						},
						{
							originName: '拨号数量',
							name: "拨号数量",
							icon: 'circle',
						},
						{
							originName: '接通数量',
							name: "接通数量",
							icon: 'circle',
						}
						]
					},
					color: ["#398EEB", "#5DBAD3", "#5EB25D", "#ed8f4a"],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'line' // 默认为直线，可选为：'line' | 'shadow'
						},
					},
					xAxis: {
						type: 'category',
						data: [],
						axisTick: { // 刻度线
							show: false
						},
						axisLine: { // 轴
							show: false
						},
					},
					yAxis: [
						{
							type: 'value',
							name: "客户数量（个）",
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
							},
						},
						{
							type: 'value',
							name: "拨号数量（个）",
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
							},
						}
					],
					 dataZoom: [
						{
							show: true,
							realtime: true,
							start: 0,
							end: 100,
							xAxisIndex: [0] // 控制第0个x轴
						}
					],
					series: [
						{
							name: '添加客户',
							data: [],
							type: 'line',
						},
						{
							name: '领取客户',
							data: [],
							type: 'line',
						},
						{
							name: '拨号数量',
							data: [],
							type: 'line',
							yAxisIndex: 1,
 
						},
						{
							name: '接通数量',
							data: [],
							type: 'line',
							yAxisIndex: 1,
						}
					]
				}
			},	
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleMainWorkData.listInfo;
		}
	},
	created() {
		this.loadChartData();
		this.loadTimeConfig();
		this.$vc.on('SALE_MAIN_WOEK_DATA_SEARCH', (query) => {
			this.loadChartData(query);
		});
	},
	beforeDestroy() {
		this.$vc.off('SALE_MAIN_WOEK_DATA_SEARCH');
	},
	methods: {
		handleChartTypeChange(val) {
			this.chart.option.series.forEach(it => {
				it.type = val;
			});
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_MAIN_WORK_DATA_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then(res => {
				// this.maxCallTime = res.data.max_call_time;
			});
		},
		loadChartData(query = this.$route.query) {
			this.$request({
				url: '_SALE_MAIN_WORK_DATA_MORE_CHART_GET', 
				type: "GET",
				param: { ...query },
				loading: false,
			}).then(({ data }) => {
				const option = this.chart.option;
				option.xAxis.data = data.time_line;
				option.series[0].data = data.add_data;
				option.series[1].data = data.get_data;
				option.series[2].data = data.call_data;
				option.series[3].data = data.call_connect;
				const { add_num, get_num, call_num, connect_num } = data;
				const numArr = [add_num, get_num, call_num, connect_num];
				this.chart.labelList.forEach((it, index) => {
					it.value = numArr[index];
				});
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadTimeConfig() {
			this.$request({
				url: "_SALE_MAIN_WORK_DATA_MORE_TIME_CONFIG_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				this.maxCallTime = res.data.call_time;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleChangeChartType() {
			if (this.chart.chartType == 'line') {
				this.chart.chartType = 'bar';
			} else {
				this.chart.chartType = 'line';
			}
			this.chart.option.series.forEach(se => {
				se.type = this.chart.chartType;
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_MAIN_WORK_DATA_LIST_INIT');
		},
		handleExport() {
			window.open(getHashUrl(API_ROOT.SALE_MAIN_WORK_DATA_LIST_GET, {
				...this.$route.query,
				export: 1,
				'-token': this.$global.token
			}));
		},
		handleChangeCallRankType(val) {
			this.loadDialingRank(this.$route.query);
		}
	}
};
</script>

<style lang="scss">
.v-sale-main-work-data-list {
	._quailty {
            border: 1px solid #ebeef1;
            border-radius: 4px;
            overflow: hidden;
            .__title {
                height: 50px;
                line-height: 50px;
                padding-left: 20px;
                font-size: 14px;
                color: #333333;
                background: #f8f8f8;
            }
            .__echarts {
                border-bottom: 1px solid #ebeef1;
            }
        }
	._quailty:hover {
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
	}
	._rank-index {
		background:rgba(255,222,225,1);
		border-radius:3px;
		width:20px;
		height: 20px;
		display: inline-block;
		color: #FF7F7F;
		text-align: center;
		margin-right: 10px;
		&._rank-0 {
			background: #FF4747;
			color:white;
		}
		&._rank-1 {
			background: #FF8547;
			color:white;
		}
		&._rank-2 {
			background: #FFAC38;
			color:white;
		}
	}
	._rank-tbody {
		height: 100px;
		overflow: auto;
	}
	._rank-row {
		margin: 10px 0px;
	}
	._rank-label {
		display: inline-block;
		width: 49%;
		line-height: 30px;
	}
	._left-border-bar {
		display: inline-block;
		width: 2px;
		position: relative;
		top: 2px;
		background-color: #e74854;
		margin-right: 5px;
		height: 14px;
	}
	._legend-bar {
		display: inline-block;
		width:12px;
		height:12px;
		margin-right: 5px;
		border-radius:2px;
		position: relative;
		top: 2px;
		&._blue {
			background:rgba(46,157,250,1);
		}
		&._green {
			background:#5DCA4D
		}
	}
}
</style>
