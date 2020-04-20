
<template>
	<div class="v-hr-entrytrend-echars">
		<vc-echarts v-if="loading" :options="option" :auto-resize="true"/>
		<oa-loading v-else/>
	</div>
</template>

<script>
import { RadioGroup, Radio, Divider } from "iview";
import { Echarts } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "oa-finance-echarts",
	components: {
		"vc-echarts": Echarts,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-divider": Divider
	},
	props: {
		years: {
			type: Object,
			default() {
				return { year_month: [{}], last_year_month: [{}] };
			}
		},
	},
	data() {
		return {
			echartMonth: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			echartcolor: ["#2ec55b", "#128fe7"],
			option: {},
			loading: false,
			type: 0,
			isActive: "g-c-orange-dark"
		};
	},
	watch: {
		years() {
			this.handleProcessingData(this.years);
		}
	},

	methods: {
		handleProcessingData(data) {
			let year_month = data.year_month.map((item) => {
				return item.entry_counts;
			});
			let last_year_month = data.last_year_month.map((item) => {
				return item.entry_counts;
			});
			this.loading = true;
			let newData = {
				color: this.echartcolor,
				tooltip: {
					show: true,
					trigger: "axis",
					formatter: params => {
						let tip = `${params[0].marker}${data.year_month[params[0].dataIndex].detail}
						<br/>
						${params[1].marker}${data.last_year_month[params[1].dataIndex].detail}`;
						return tip;
					}
				},
				legend: {
				},
				xAxis: {
					type: "category",
					data: this.echartMonth
				},
				yAxis: {
					type: "value",
					axisLabel: {
						formatter: "{value}"
					}
				},
				grid: {
					top: "10px",
					left: "60px",
					right: "60px",
					bottom: "50px"
				},
				series: [
					{
						type: "line",
						data: year_month
					},
					{
						type: "line",
						data: last_year_month
					}
				]
			};
			this.option = newData;
		},
	}
};
</script>

<style lang="scss">
.v-hr-entrytrend-echars {
    height: 400px;
    width: 100%;
    border-radius: 6px;
    padding-bottom: 20px;
	position: relative;
	padding-top: 50px;
	._mask {
		opacity: 0 !important;
	}
}
</style>
