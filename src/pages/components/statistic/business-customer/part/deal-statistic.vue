<template>
	<div>
		<oa-panel :tabs="tabs" title="成交客户统计" @tab-change="handleTabChange">
			<oa-mix-picker 
				v-model="time"
				:type="curTabValue"
				class="g-m-r-5"
				@change="handleTimeChange"
			/>
			<i-select
				v-model="depart_id"
				placeholder="请选择战区"
				style="width:220px"
				clearable
				@on-change="handleDepartChange"
				
			>
				<i-option
					v-for="(item,index) in departList"
					:key="index"
					:value="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>
			<div class="g-m-tb-10 g-fs-14">
				<span class="g-m-r-20">成交客户：{{ head.customer_num }}家</span>
				<span>成交金额：{{ head.amount }}万</span>
			</div>
			<div class="g-flex g-fw-w">
				<oa-pie-chart 
					v-for="item in datas" 
					:data="item.data" 
					:title="item.title" 
					:key="item.chartType"
					:chart-type="item.chartType"
					:time="time"
					:tab="curTabValue"
					style="width:49%"
					@click-pie="handleClickPie"
				/>
			</div>
		</oa-panel>
	</div>
</template>
<script>
import { Input, Button, Select, Option, DatePicker, Cascader } from 'iview';
import { getSeasonTree, getYearList, getFormatNum } from '@utils/utils';
import moment from 'moment';
import { debounce, cloneDeep } from 'lodash';
import { services } from '@stores/services/sale';
import Panel from '../../_common/panel';
import MixPicker, { getInitTime, getTargetSeasonTree } from '../../_common/mix-picker';
import PieChart from '../../_common/pie-chart';
import { departListMixin } from '../../_common/util';

export default {
	name: 'oa-statistic-business-customer-part-deal',
	components: {
		'i-input': Input, 
		'i-button': Button,
		'i-select': Select, 
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'oa-panel': Panel,
		'oa-mix-picker': MixPicker,
		'oa-pie-chart': PieChart
	},
	mixins: [
		services.departAll(), 
		services.firstDepartId(), 
		services.targetSeason(),
		departListMixin
	],
	data() {
		return {
			curTabValue: 1,

			tabs: [
				{ label: '累计', value: 1, loaded: false, data: undefined }, // 缓存
				{ label: '年度', value: 2, loaded: false, data: undefined },
				{ label: '季度', value: 3, loaded: false, data: undefined },
				{ label: '月度', value: 4, loaded: false, data: undefined }
			],
			datas: [
				{ data: undefined, chartType: 1, title: '按行业' }, // 实时
				{ data: undefined, chartType: 2, title: '按区域' },
				{ data: undefined, chartType: 3, title: '按类型' },
				{ data: undefined, chartType: 4, title: '按折扣' }
			],
			head: {
				amount: '0.00',
				customer_num: '0.00',
			},
			
			time: getInitTime(),
			depart_id: '',
			
		
		};
	},
	computed: {
		// departList() {
		// 	if (this.firstDepartId.sale) {
		// 		const sale = this.departAll.find(dep => dep.value == this.firstDepartId.sale);
		// 		if (!sale) return [];
		// 		const deps = sale.children.map(it => ({ value: it.value, label: it.label }));
		// 		deps.unshift({ value: this.firstDepartId.sale, label: '营销中心' });
		// 		return deps; 
		// 	} else return [];
		// },
	},
	created() {
		this.handleSearch();
	},
	methods: {
		handleTabChange(tab) {
			this.curTabValue = tab.value;
			const curTab = this.tabs.find(it => it.value == tab.value);
			if (curTab.loaded) {
				this.datas = curTab.data;
				this.head = curTab.head;
			} else this.handleSearch();
		},
		loadData() {
			const type = this.curTabValue; // 防止未加载完毕时切换tab
			const param = { 
				depart_id: this.depart_id, 
				type, 
				year: this.time.year, 
				season: this.time.season[this.time.season.length - 1], 
				month: this.time.month 
			};
			
			Promise.all([
				this.loadIndustryData(param),
				this.loadAreaData(param),
				this.loadTypeData(param),
				this.loadDiscountData(param),
				this.loadTotalData(param)
			]).then(() => {
				const curTab = this.tabs.find(it => it.value == type);
				if (!curTab) return console.error('type not found -- type: ' + type);
				curTab.data = cloneDeep(this.datas);
				curTab.head = { ...this.head };
				curTab.loaded = true;
			});
		},
		getPieData(data) {
			const legendData = data.statistics_dimension.map(i => i.value);
			return {
				1: { // 成交客户
					legendData,
					seriesData: data.customer_num.map((num, index) => ({ 
						value: num, 
						name: data.statistics_dimension[index].value,
						id: data.statistics_dimension[index].id,
						percent: data.customer_proportion[index],
					}))
				},
				2: { // 成交金额
					legendData,
					seriesData: data.deal_amount.map((num, index) => ({ 
						value: num, 
						name: data.statistics_dimension[index].value,
						id: data.statistics_dimension[index].id,
						percent: data.deal_amount_proportion[index],
						
					}))
				},
			};

		},

		loadIndustryData(param) {
			return this.$request({
				url: "_STATISTIC_BUSINESS_CUSTOMER_DEAL_INDUSTRY_GET",
				type: "GET",
				param,
				loading: false,
			}).then(res => {
				this.datas[0].data = this.getPieData(res.data);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadAreaData(param) {
			return this.$request({
				url: "_STATISTIC_BUSINESS_CUSTOMER_DEAL_AREA_GET",
				type: "GET",
				param,
				loading: false,
			}).then(res => {
				this.datas[1].data = this.getPieData(res.data);
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		loadTypeData(param) {
			return this.$request({
				url: "_STATISTIC_BUSINESS_CUSTOMER_DEAL_TYPE_GET",
				type: "GET",
				param,
				loading: false,
			}).then(res => {
				this.datas[2].data = this.getPieData(res.data);
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		loadDiscountData(param) {
			return this.$request({
				url: "_STATISTIC_BUSINESS_CUSTOMER_DEAL_DISCOUNT_GET",
				type: "GET",
				param,
				loading: false,
			}).then(({ data }) => {
				this.datas[3].data = { 
					1: { // 成交客户
						legendData: data.statistics_dimension.map(i => i.value),
						seriesData: data.discount_num.map((num, index) => ({ 
							value: num, 
							name: data.statistics_dimension[index].value,
							id: index + 1,
							percent: data.discount_rate[index],
						}))
					} 
				};
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		loadTotalData(param) {
			const { time, season, year } = this.time;
			this.$request({
				url: "_STATISTIC_BUSINESS_CUSTOMER_DEAL_TOTAL_GET",
				type: "GET",
				param,
				loading: false,
			}).then(({ data }) => {
				this.head = { 
					amount: getFormatNum(data.amount / 10000),
					customer_num: getFormatNum(data.customer_num, 0) 
				};
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleSearch: debounce(function () {
			this.loadData();


		}, 10),
		handleDepartChange() {
			this.tabs.forEach(tab => {
				tab.loaded = false;
				tab.data = undefined;
			});
			this.handleSearch();
		},
		handleTimeChange(time) {
			this.handleSearch();
		},
		handleClickPie({ param, path }) {
			if (!this.$auth[1788]) return;
			const query = { 
				...param,
				year: this.time.year, 
				seasons: this.time.season.join(';'),
				season: this.time.season[this.time.season.length - 1],
				month: this.time.month, 
				type: this.curTabValue,
				depart_id: this.depart_id
			};
			this.$router.push({
				path,
				query
			});

		}

	}
};
</script>
<style lang="scss">
</style>