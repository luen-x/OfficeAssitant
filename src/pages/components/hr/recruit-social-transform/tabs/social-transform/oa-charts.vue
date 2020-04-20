
<template>
	<div>
		<div :style="{width: '100%', height:'354px'}">
			<vc-echarts :options="ooption" :auto-resize="true" />
		</div>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	name: "oa-tpl",
	components: {
		"vc-echarts": Echarts
	},
	props: {
		dataLabel: Array,
		dataValue: Array,
		detail: Array,
		value: Array,
	},
	data() {
		return {
			label: [],
			ooption: {} // 籍贯统计图
		};
	},
	watch: {
		// 监听数据变化
		value() {
			// 籍贯统计图
			this.ooption = {
				tooltip: {
					show: true,
					trigger: "axis",
					formatter: params => {
						this.index = params[0].dataIndex;
						return `${this.detail[params[0].dataIndex]}`;
					},
					axisPointer: {
						type: 'none'
					}

				},
				grid: {
					left: "3%",
					right: "3%",
					bottom: "5%",
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: this.dataLabel,
					axisLabel: {
						rotate: 45
					}
				},
				yAxis: {
					type: "value",
					minInterval: 1,
					axisLabel: {
						formatter: "{value}人"
					}
				},
				series: [
					{
						barWidth: "32px", // 柱子宽度
						barCategoryGap: "10px", // 柱间距离
						color: ["#388feb"],
						data: this.value,
						type: "bar"
					}
				]
			};
		}
	},
	created() {

	},
	methods: {}
};
</script>

<style lang="scss" scoped>
</style>
