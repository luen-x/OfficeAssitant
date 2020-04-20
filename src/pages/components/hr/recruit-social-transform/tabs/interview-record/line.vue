<template>
	<div class="v-hr-record-echars-line">
		<oa-loading v-if="loading"/>
		<div v-else>
			<div class="g-flex _border">
				<span class="g-flex g-flex-ac g-flex-cc g-fd-c _show">
					<span class="g-fs-16 g-c-black3">当日面试最高人数</span>
					<span class="g-c-black1 g-fs-20">{{ record.today_height&&record.today_height[index] }}</span>
				</span>
				<span class="g-flex g-flex-ac g-flex-cc g-fd-c _show">
					<span class="g-fs-16 g-c-black3">当日平均面试人数</span>
					<span class="g-c-black1 g-fs-20">{{ record.today_average&&record.today_average[index] }}</span>
				</span>
			</div>
			<vc-echarts :options="option" :auto-resize="true" class="_echarts" />
		</div>
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
		record: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	data() {
		return {
			index: new Date().getDate() - 1,
			loading: true,
			option: {},
			isActive: "g-c-orange-dark"
		};
	},
	watch: {
		record() {
			this.handleProcessingData(this.record);
		}
	},
	methods: {
		handleProcessingData(data) {
			let newData = {
				color: ["#2ec55b"],
				tooltip: {
					show: true,
					trigger: "axis",
					formatter: params => {
						this.index = params[0].dataIndex;
						return `${data.detail[params[0].dataIndex]}`;
					}
				},
				legend: {},
				xAxis: {
					type: "category",
					data: data.label
				},
				yAxis: {
					type: "value",
					axisLabel: {
						formatter: "{value}"
					}
				},
				grid: {
					top: "40px",
					left: "40px",
					right: "0px",
					bottom: "40px",
				},
				series: [{
					// name: '2018',
					type: "line",
					data: data.value
				}]
			};
			this.loading = false;
			this.option = newData;
		},
	}
};
</script>

<style lang="scss" scope>
.v-hr-record-echars-line {
	// width: 100%;
	// border:1px solid red;
	// height: 100%;
	// border-radius: 6px;
	margin-top:200px;
	._mask {
		opacity: 0 !important;
	}
	._border {
		margin-top:-180px;
		border: 1px solid #ebf0f1;
		padding: 20px;
		background-color: #f5f5f6;
		._show {
			height: 62px;
			width: 50%;
		}
		._show+._show {
			border-left: 1px solid #d5d9dd;
		}
	}
	._echarts{
		height: 400px !important;
	}
}
</style>