<template>
	<div class="v-statistic-business-customer-part-rebuy-customer">
		<oa-panel title="复购客户" more-label="进入看板" padding="20px 20px 20px 0px" @more="handleMore">
			<div class="g-m-b-10 g-flex g-jc-sb g-pd-l-20">
				<i-select
					v-model="year"
					:clearable="false"
					placeholder="请选择"
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
						v-if="$auth[1797]"
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
						<img 
						
							:src="OSS_SEARCH_EMPTY"
						>
					</div>
					<div v-for="(item,index) in customerList" :key="index" class="_row g-c-black2" >
						<div class="g-fs-14">
							<span class="g-dp-ib g-pd-l-10" style="width:35px">
								<span :class="index<3?'_rank-'+index:''" class="g-rank-index" style="width:20px"> {{ index+1 }}</span>
							</span>
							<span class="__cell _hover g-pointer" style="width:140px" @click="handleLinkZone(item.zone_depart_id)">
								{{ item.depart_name }}({{ item.depart_manage_staff_name }})
							</span>
							<span class="__cell" style="width:60px">{{ item.customer_repeat_num }}家</span>
							<span class="__cell" style="width:110px">¥ {{ item.repeat_amount_total }}</span>
						</div>
						<div style="margin-left:40px" class="g-c-black7">
							复购率：{{ item.rateStr }}
						</div>
					</div>
				</div>
				<div class="_right g-col">
					<div class="g-pd-l-20 g-fs-14 g-c-black7 g-pd-b-10">
						<span class="g-m-r-20">成交客户：{{ head.total_repeat_amount_total }}家</span>
						<span>复购金额：¥{{ head.total_repeat_amount_total }}</span>
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
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Loading from '@common/loading/loading';
import { download } from '@utils/download';
import Panel from '../../_common/panel';

export default {
	name: 'oa-rebuy-customer',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-table': Table,
		'vc-echarts': Echarts,
		'oa-panel': Panel,
		'oa-loading': Loading
	},
	data() {
		const yearList = getYearList(2018);

		return {
			OSS_SEARCH_EMPTY,
			loading: false,
			yearList,
			year: yearList[yearList.length - 1].value,
			customerList: [],
			head: {
				total_customer_repeat_num: 0,
				total_repeat_amount_total: "0.00"
			},
			showChart: true,
			chartOption: {
				color: ['#2E9DFA', '#EC505B', '#5DCA4D'],
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					},
					formatter: '{b0}<br/>{a0}：{c0}个<br />{a1}：{c1}个<br />{a2}：{c2}元'

				},
				legend: {
					data: ['个人客户', '公司客户', '复购金额'],
					left: 20,
					icon: "roundRect",
					itemWidth: 14,
					itemHeight: 14,
					itemGap: 40,
					borderRadius: 4,
				},
				grid: {
					left: '5%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				
				xAxis: [
					{
						type: 'category',
						data: [],
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
						nameTextStyle: {
							padding: [0, 0, 0, 10],
						},
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
						name: '复购金额（万元）',
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
						data: []
					},
					{
						name: '公司客户',
						stack: '客户',
						type: 'bar',
						barWidth: '20%',
						barMaxWidth: '24px',						
						data: []
					},
					{
						name: '复购金额',
						type: 'bar',
						yAxisIndex: 1,
						barWidth: '20%',
						barMaxWidth: '24px',						
						data: []
					}
				]
			},
			table: {
				data: [],
				columns: [
					{
						title: '战区',
						key: 'depart_name',
						minWidth: 100
					},
					{
						title: '成交客户',
						key: 'deal_customer',
						minWidth: 100
					},
					{
						title: '个人客户',
						key: 'personal',
						minWidth: 100
					},
					{
						title: '公司客户',
						key: 'company',
						minWidth: 100
					},
					{
						title: '复购金额',
						key: 'repeat_amount_total',
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
		handleSearch() {
			setTimeout(() => {
				this.loadData();
			}, 10);
		},
		loadData() {
			this.customerList = [];
			this.loading = true;
			this.$request({
				url: "STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST_GET",
				type: "GET",
				param: {
					year: this.year,
					is_page: 0
				},
				loading: false,
			}).then(res => {
				const arr = res.data.list;
				const seriesData = arr.length ? arr : [{ 'personal': 0, 'company': 0, 'repeat_amount_total': 0, depart_name: "暂无数据" }];
				setSeriesData(this.chartOption.series, seriesData, ['personal', 'company', 'repeat_amount_total']);
				setSeriesData(this.chartOption.xAxis, seriesData, ['depart_name']);
				const rateStrFn = it => it.percent + '(' + it.year + ')';
				const arr2 = arr.map(it => ({
					...it,
					deal_customer: getFormatNum(it.deal_customer, 0),
					personal: getFormatNum(it.personal, 0),
					company: getFormatNum(it.company, 0),
					repeat_amount_total: getFormatNum(it.repeat_amount_total, 2),
					rateStr: it.repeat_rate.map(rateStrFn).join(' / ') || '-'
				}));
				this.customerList = arr2;
				this.table.data = arr2;	
				this.head = {
					total_customer_repeat_num: res.data.total_customer_repeat_num,
					total_repeat_amount_total: res.data.total_repeat_amount_total
				};		
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			}).finally(() => {
				this.loading = false;
			});
		},
		resize() {
			this.$refs.chart.chart && this.$refs.chart.chart.resize();
		},
		handleMore() {
			if (!this.$auth[1794]) {
				this.$Message.warning('暂无权限查看');
				return;
			}
			this.$router.push({
				path: '/statistic/business/customer/rebuy',
				query: {
					year: this.year
				} 
			});
		},
		handleExport() {
			download({
				path: "_STATISTIC_BUSINESS_CUSTOMER_REBUY_EXPORT_GET",
				query: { year: this.year }
			});
			// window.open(getHashUrl(API_ROOT._STATISTIC_BUSINESS_CUSTOMER_REBUY_EXPORT_GET, {
			// 	year: this.year,
			// 	'-token': this.$global.token
			// }));
		},
		handleLinkZone(id) {
			if (!this.$auth[1794]) {
				this.$Message.warning('暂无权限查看');
				return;
			}
			this.$router.push({
				path: '/statistic/business/customer/rebuy',
				query: {
					year: this.year,
					zone_depart_id: id
				} 
			});
		},
	}
};
</script>
<style lang="scss">
.v-statistic-business-customer-part-rebuy-customer {
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
	// ._row {
	// 	padding: 10px 0;
	// 	border-bottom: 1px solid #F2F2F2;
	// 	.__cell {
	// 		display: inline-block;
	// 	}
	// 	transition: all .3s ease;
	// 	cursor: pointer;
	// 	&:hover {
	// 		scale: 1.11 1.1;
	// 		padding-left: 10px;
	// 		// box-shadow: 5px 5px 5px 5px  #f7f7f7;
	// 		background: #f8f8f9
			
	// 	}
	// }
}

</style>