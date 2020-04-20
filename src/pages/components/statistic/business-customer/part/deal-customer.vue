<template>
	<div class="v-statistic-business-customer-part-deal-customer">
		<oa-panel title="成交客户" padding="20px 20px 20px 0px">
			<div class="g-m-b-10 g-flex g-jc-sb g-m-l-20">
				<i-select
					v-model="year"
					:clearable="false"
					placeholder="请选择年份"
					style="width:220px"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,index) in yearList"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<div>
					<i 
						v-if="1789"
						class="iconfont icon-download g-fs-18 g-m-r-20 g-pointer"
						style="color: #2397F9;"
						@click="handleExport"
					/>
					<i 
						:class="showChart?'icon-table':'icon-pie'"
						class="iconfont icon-table g-fs-18 g-pointer"
						style="color: #2397F9;"
						@click="showChart = !showChart"
					/>
					
					
				</div>

			</div>
			<div class="g-flex">
				<div class="_left g-overlay g-relative">
					<oa-loading v-if="loading"/>
					<div v-else-if="customerList.length==0" class="g-tc g-m-t-30">
						<img :src="OSS_SEARCH_EMPTY">
					</div>
					<div v-for="(item,index) in customerList" :key="index" class="_row g-c-black2 g-fs-14" >
						<span class="g-dp-ib g-pd-l-10" style="width:35px">
							<span :class="index<3?'_rank-'+index:''" class="g-rank-index" > {{ index+1 }}</span>
						</span>
						<span class="__cell" style="width:140px">
							<oa-auto-tooltip
								:content="item.depart_name+'('+ item.manager +')'"
								theme="dark"
								placement="bottom"
								label-class=" "
							/>
						</span>
						<span class="__cell" style="width:60px">{{ item.customer_total }}家</span>
						<span class="__cell" style="width:110px">¥{{ item.amount }}</span>
					</div>
				</div>
				<div class="_right g-col">
					<div class="g-pd-l-20 g-fs-14 g-c-black7 g-pd-b-10">
						<span class="g-m-r-20">成交客户：{{ head.total_num }}家</span>
						<span>成交金额：¥{{ head.total_payment }}</span>
					</div>
					<div style="height:300px;">
						
						<vc-echarts 
							v-if="showChart"
							ref="chart"
							:options="chartOption"
							:auto-resize="true"
						/>
						<i-table 
							v-else 
							:columns="table.columns" 
							:data="table.data"
							:height="300"
							stripe 
							class="g-m-l-20"/>
					</div>
				</div>
				

			</div>
			
		</oa-panel>
	</div>
</template>
<script>
import { Input, Button, Select, Option, Table } from 'iview';
import { Echarts } from "wya-vc";
import { getYearList, setSeriesData, getFormatNum, getHashUrl } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import Loading from '@common/loading/loading';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { download } from '@utils/download';
import Panel from '../../_common/panel';

export default {
	name: 'oa-deal-customer',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-table': Table,
		'vc-echarts': Echarts,
		'oa-panel': Panel,
		'oa-auto-tooltip': AutoTooltip,
		'oa-loading': Loading
	},
	data() {
		const yearList = getYearList(2018);

		return {
			OSS_SEARCH_EMPTY,
			yearList,
			loading: false,
			year: yearList[yearList.length - 1].value,
			customerList: [],
			showChart: true,
			head: {
				total_num: "0",
				total_payment: "0.00"

			},
			chartOption: {
				color: ['#2E9DFA', '#EC505B', '#5DCA4D'],
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					},
					formatter: '{b0}<br/>{a0}：{c0}个<br/>{a1}：{c1}个<br/>{a2}：{c2}元'
					// (param) => {
					// 	console.log(param);
					// 	return '{b0}<br/>{a0}：{c0}个<br/>{a1}：{c1}个<br/>{a2}：{c2}元';
					// }

				},
				legend: {
					data: ['个人客户', '公司客户', '成交金额'],
					left: 20,
					icon: "roundRect",
					itemWidth: 14,
					itemHeight: 14,
					itemGap: 40,
					borderRadius: 4,
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				
				xAxis: [
					{
						type: 'category',
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
						axisTick: { // 刻度线
							show: false
						},
						axisLine: { // 轴
							show: false
						},
					}
				],
				yAxis: [
					{
						name: '客户数量（个）',
						type: 'value',
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},
						nameTextStyle: {
							padding: [0, 0, 0, 10],
						},
						axisTick: { // y轴刻度线
							show: false
						},
						axisLine: { // y轴
							show: false
						},
					},
					{
						name: '成交金额（万元）',
						type: 'value',
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
							formatter: (value, index) => {
								return getFormatNum(value / 1000, 0);
							}
						}
					}
				],
				series: [
					{
						name: '个人客户',
						stack: '客户',
						barWidth: '20%',
						barMaxWidth: '24px',						
						type: 'bar',
						data: [320, 332, 301, 334, 390, 330, 320]
					},
					{
						name: '公司客户',
						stack: '客户',
						type: 'bar',
						barWidth: '20%',
						barMaxWidth: '24px',						
						data: [120, 132, 101, 134, 90, 230, 210]
					},
					{
						name: '成交金额',
						type: 'bar',
						yAxisIndex: 1,
						barWidth: '20%',
						barMaxWidth: '24px',						
						data: [220, 182, 191, 234, 290, 330, 310]
					}
				]
			},
			table: {
				data: [
					  {
						"depart_name": "杭四战区",
						"manager": "杭四新总监,陈杭四总监",
						"customer_company": 134, // 成交客户数（公司客户）
						"customer_personal": 1, // 成交客户数（个人客户）
						"amount": "359662968.79" // 成交金额
					}
				],
				columns: [
					{
						title: '战区',
						key: 'depart_name',
						minWidth: 100
					},
					{
						title: '成交客户',
						key: 'customer_total',
						minWidth: 100
					},
					{
						title: '个人客户',
						key: 'customer_personal',
						minWidth: 100
					},
					{
						title: '公司客户',
						key: 'customer_company',
						minWidth: 100
					},
					{
						title: '成交金额',
						key: 'amount',
						minWidth: 100
					}

				]
			}

		};
	},
	created() {
		this.loadData();
		window.addEventListener('resize', this.resize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.resize);

	},
	methods: {
		loadData() {
			this.loading = true;
			this.customerList = [];
			this.$request({
				url: "_STATISTIC_BUSINESS_CUSTOMER_DEAL_CUSTOMER_GET",
				type: "GET",
				param: {
					year: this.year,
					type: 2
				},
				loading: false,
			}).then(res => {

				const arr = res.data.list;
				const seriesData = arr.length ? arr : [{ 'customer_personal': 0, 'customer_company': 0, 'amount': 0, depart_name: "暂无数据" }];
				setSeriesData(this.chartOption.series, seriesData, ['customer_personal', 'customer_company', 'amount']);
				setSeriesData(this.chartOption.xAxis, seriesData, ['depart_name']);
				const rateStrFn = it => it.percent + '(' + it.year + ')';
				const arr2 = arr.map(it => ({
					...it,
					customer_total: getFormatNum(it.customer_total, 0),
					customer_company: getFormatNum(it.customer_company, 0),
					customer_personal: getFormatNum(it.customer_personal, 0),
					amount: getFormatNum(it.amount, 2),

					// renew_amount_total: getFormatNum(it.renew_amount_total, 2),
					// rateStr: it.renew_rate.map(rateStrFn).join(' / ') || '-'
				}));
				this.customerList = arr2;
				this.table.data = arr2;
				this.head = {
					total_num: getFormatNum(res.data.total.total_num, 0),
					total_payment: getFormatNum(res.data.total.total_payment),
				};
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			}).finally(() => {
				this.loading = false;
			});

		},
		handleSearch() {
			setTimeout(() => {
				this.loadData();
			}, 10);
		},
		handleExport() {
			download({
				path: '_STATISTIC_BUSINESS_CUSTOMER_DEAL_CUSTOMER_GET',
				query: {
					year: this.year,
					type: 2,
					export: 1
				}
			});
		},
		resize() {
			this.$refs.chart.chart && this.$refs.chart.chart.resize();
		}
		
	}
};
</script>
<style lang="scss">
.v-statistic-business-customer-part-deal-customer {
	._left {
		border-right: 1px solid #f8f8f8;
		height: 320px;
		width: 410px;
		min-width: 410px;
	}
	._row {
		padding: 10px 0;
		margin-left: 20px;
		border-bottom: 1px solid #F2F2F2;
		margin-right: 20px;
		transition: all 0.3s ease;
		.__cell {
			display: inline-block;
		}
		._hover {
			transition: all 0.3s ease;
		}
		&:hover {
			// scale: 1.11 1.1;
			// padding-left: 10px;
			// box-shadow: 5px 5px 5px 5px  #f7f7f7;
			background:rgba(250,250,250,1);
			
			._hover {
				
				color: #2296f9;
			}
		}
	}
}

</style>