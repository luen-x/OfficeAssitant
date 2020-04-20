<template>
	<div class="v-statistics-customer-employee-type">
		<div class="g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40">
			<i-input
				v-model="keyword" 
				placeholder="请输入员工姓名或手机号" 
				clearable
				transfer
				class="g-m-r-5"
				style="width: 220px" 
				@on-enter="handleSearch"
				@on-change="handleSearch"
			/>
			<i-cascader
				:data="departAllOfSale"
				v-model="depart_id"
				:change-on-select="true"
				transfer
				clearable
				placeholder="请选择组织"
				trigger="click"
				style="width: 220px;display: inline-block"
				class="g-m-r-5"
				@on-change="handleChange"
			/>
			<i-date-picker 
				v-model="month" 
				:clearable="false" 
				type="month"
				placeholder="请选择月份"
				style="width: 220px;display: inline-block"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>
		<div :style="{ width: '100%', height:'354px'}">
			<vc-echarts :options="tableData.option" :auto-resize="true" class="g-m-t-10"/>
		</div>
	</div>
</template>

<script>
import { Input, Button, Cascader, DatePicker } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/hr';
import { Echarts } from "wya-vc";
import moment from 'moment';
import API_ROOT from '@stores/apis/root';

const colors = {
	blue: '#2397f9',
	yellow: '#e8dc46',
	green: '#5dca4d',
	red: '#ec5058',
};
export default {
	name: 'oa-statistics-customer-employee-type',
	components: {
		"vc-echarts": Echarts,
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: '',
			month: '',
			depart_id: [],
			timeline: [],
			tableData: {
				title: {
					text: "折线图堆叠"
				},
				option: {
					legend: { 
						data: [
							{ name: '领取客户', icon: 'circle' },
							{ name: '归还客户', icon: 'circle' }, 
							{ name: '新增客户', icon: 'circle' }, 
							{ name: '成交客户', icon: 'circle' }
						] 
					},
					tooltip: {
						trigger: 'axis'
					},
					xAxis: {
						data: [],
						boundaryGap: false,
					},
					yAxis: {},
					series: [
						{
							name: '领取客户',
							type: 'line',
							data: [],
							itemStyle: {
								color: colors.blue
							}
						}, 
						{
							name: '归还客户',
							type: 'line',
							data: [],
							itemStyle: {
								color: colors.yellow
							}
						}, 
						{
							name: '新增客户',
							type: 'line',
							data: [],
							itemStyle: {
								color: colors.green
							}
						}, 
						{
							name: '成交客户',
							type: 'line',
							data: [],
							itemStyle: {
								color: colors.red
							}
						} 
					]
				}
			},
		};
	},
	computed: {
		departAllOfSale() {
			if (this.departAll == undefined || !this.departAll.length || !this.departAll[0].label) return [];
			const departTree = this.departAll.filter(v => v.label.includes('营销'))[0].children;
			departTree.forEach(v => {
				if (!v.children) {
					v.disabled = true;
				}
			});
			return departTree;
		},
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		const curDate = new Date();
		this.month = moment(curDate).format('YYYY.MM');
		this.handleEchartsData();
	},
	methods: {
		handleChange(value, selected) {
			if (!selected.length) {
				this.depart_id = [];
				this.handleSearch();
				return;
			}
			this.depart_id = [value[value.length - 1]];
			this.handleSearch();
		},
		handleEchartsData() {
			this.$request({
				url: API_ROOT['_STATISTICS_CUSTOMER_EMPLOYEE_TYPE_GET'],
				type: 'GET',
				loading: false,
				param: {
					keyword: this.keyword,
					depart_id: this.depart_id.length && this.depart_id[this.depart_id.length - 1],
					month: moment(this.month).format('YYYY-MM')
				}
			}).then(res => {
				let receiveArr = [];
				let returnArr = [];
				let addArr = [];
				let dealArr = [];
				this.tableData.option.xAxis.data = res.data.time_line;
				if (res.data.info) {
					res.data.info.forEach(element => {
						receiveArr.push(element[0].num);
						returnArr.push(element[1].num);
						addArr.push(element[2].num);
						dealArr.push(element[3].num);
					});
					this.$set(this.tableData.option.series, 0, {
						...this.tableData.option.series[0],
						data: receiveArr
					});
					this.$set(this.tableData.option.series, 1, {
						...this.tableData.option.series[1],
						data: returnArr
					});
					this.$set(this.tableData.option.series, 2, {
						...this.tableData.option.series[2],
						data: addArr
					});
					this.$set(this.tableData.option.series, 3, {
						...this.tableData.option.series[3],
						data: dealArr
					});
				} else {
					this.$set(this.tableData.option.series, 0, {
						...this.tableData.option.series[0],
						data: []
					});
					this.$set(this.tableData.option.series, 1, {
						...this.tableData.option.series[1],
						data: []
					});
					this.$set(this.tableData.option.series, 2, {
						...this.tableData.option.series[2],
						data: []
					});
					this.$set(this.tableData.option.series, 3, {
						...this.tableData.option.series[3],
						data: []
					});
				}
			});
		},
		handleSearch() {
			this.handleEchartsData();
			// this.$router.replace(getHashUrl(
			// 	'/sc/service/pause', 
			// 	{ 
			// 		...this.$route.query, 
			// 		search: this.search,
			// 		apply_name: this.apply_name,
			// 		check_name: this.check_name,
			// 		is_all: this.is_all,
			// 	}
			// ));
			// this.$store.commit('SC_SERVICE_PAUSE_LIST_INIT');
		},
	},
};
</script>

<style lang="scss" scoped>
.v-statistics-customer-employee-type {
	padding: 20px
}
</style>
