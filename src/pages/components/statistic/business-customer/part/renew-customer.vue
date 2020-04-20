<template>
	<div class="v-statistic-business-customer-part-renew-customer">
		<oa-panel title="续费客户" more-label="进入看板" padding="20px 20px 20px 0" @more="handleMore">
			<div class="g-m-b-10 g-flex g-jc-sb g-m-l-20">
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
						v-if="$auth[1793]"
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
					<div v-for="(item,index) in customerList" :key="index" class="_row g-c-black2" >
						<div class="g-fs-14">
							<span class="g-dp-ib g-pd-l-10" style="width:35px">
								<span :class="index<3?'_rank-'+index:''" class="g-rank-index" style="width:20px"> {{ index+1 }}</span>
							</span>
							<span 
								class="__cell _hover g-pointer" 
								style="width:140px"
								@click="handleLinkZone(item.zone_depart_id)"
							>
								{{ item.depart_name }}({{ item.depart_manage_staff_name }})
							</span>
							<span class="__cell" style="width:60px">{{ item.customer_renew_num }}家</span>
							<span class="__cell" style="width:110px">¥ {{ item.renew_amount_total }}</span>
						</div>
						<div style="margin-left:40px" class="g-c-black7">
							续费率：{{ item.rateStr }}
						</div>
					</div>
				</div>
				<div class="_right g-col">
					<div class="g-pd-l-20 g-fs-14 g-c-black7 g-pd-b-10">
						<span class="g-m-r-20">续费客户：{{ head.total_customer_renew_num }}家</span>
						<span class="g-m-r-20">续费金额：¥{{ head.total_renew_amount_total }}</span>
						<span>续费率：{{ head.renew_total_rate_str }}</span>
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
	name: 'oa-renew-customer',
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
			showChart: true,
			head: {
				total_customer_renew_num: '0',
				total_renew_amount_total: '0.00',
				renew_total_rate_str: ""
			},
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
					data: ['个人客户', '公司客户', '续费金额'],
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
						// nameLocation: 'center',
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
						name: '续费金额（万元）',
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
						name: '续费金额',
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
						title: '续费金额',
						key: 'renew_amount_total',
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
			this.loading = true;
			this.customerList = [];
			this.$request({
				url: "STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST_GET",
				type: "GET",
				param: {
					year: this.year,
					is_page: 0
				},
				loading: false,
			}).then(res => {
				const arr = res.data.list;
				const seriesData = arr.length ? arr : [{ 'personal': 0, 'company': 0, 'renew_amount_total': 0, depart_name: "暂无数据" }];
				setSeriesData(this.chartOption.series, seriesData, ['personal', 'company', 'renew_amount_total']);
				setSeriesData(this.chartOption.xAxis, seriesData, ['depart_name']);
				const rateStrFn = it => it.percent + '(' + it.year + ')';
				const arr2 = arr.map(it => ({
					...it,
					deal_customer: getFormatNum(it.deal_customer, 0),
					personal: getFormatNum(it.personal, 0),
					company: getFormatNum(it.company, 0),
					renew_amount_total: getFormatNum(it.renew_amount_total, 2),
					rateStr: it.renew_rate.map(rateStrFn).join(' / ') || '-'
				}));
				this.customerList = arr2;
				this.table.data = arr2;
				this.head = {
					total_customer_renew_num: getFormatNum(res.data.total_customer_renew_num, 0),
					total_renew_amount_total: getFormatNum(res.data.total_renew_amount_total),
					renew_total_rate_str: res.data.renew_total_rate.map(rateStrFn).join(' / ') || '-'
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
			if (!this.$auth[1790]) {
				this.$Message.warning('暂无权限查看');
				return;
			}
			this.$router.push({
				path: '/statistic/business/customer/renew',
				query: {
					year: this.year
				} 
			});
		},
		handleLinkZone(id) {
			if (!this.$auth[1790]) {
				this.$Message.warning('暂无权限查看');
				return;
			}
			this.$router.push({
				path: '/statistic/business/customer/renew',
				query: {
					year: this.year,
					zone_depart_id: id
				} 
			});
		},
		handleExport() {
			download({
				path: "_STATISTIC_BUSINESS_CUSTOMER_RENEW_EXPORT_GET",
				query: {
					year: this.year
				}
			});
		}
	}
};
</script>
<style lang="scss">
.v-statistic-business-customer-part-renew-customer {
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