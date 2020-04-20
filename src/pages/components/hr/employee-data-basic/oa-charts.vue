
<template>
	<div>
		<div :style="{width: '100%', height: charts_id !== 5 ? '166px' : '354px'}">
			<vc-echarts v-if="charts_id === 1" :options="soption" :auto-resize="true" />
			<vc-echarts v-if="charts_id === 2" :options="woption" :auto-resize="true" />
			<vc-echarts v-if="charts_id === 3" :options="aoption" :auto-resize="true" />
			<vc-echarts v-if="charts_id === 4" :options="toption" :auto-resize="true" />
			<vc-echarts v-if="charts_id === 5" :options="ooption" :auto-resize="true" />
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
		charts_id: Number,
		addressLabel: Array,
		value: Array,
		height: String
	},
	data() {
		return {
			label: [],
			soption: {}, // 性别分布
			woption: {}, // 工龄分布
			aoption: {}, // 年龄分布
			toption: {}, // 员工类型分布
			ooption: {} // 籍贯统计图
		};
	},
	watch: {
		// 监听数据变化
		value() {
			this.charts_id !== 5 ? this.label = this.value.map(item => item.name) : '';

			// 性别分布
			this.soption = {
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: "vertical", // 图例垂直排列
					// x: 'right',
					top: "middle", // 图例垂直居中
					right: "5%", // 图例距离右侧距离
					itemWidth: 14, // 图例的图形宽度
					data: this.label,
					formatter: (params) => {
						// 格式化图例文字
						let data = this.value;
						for (let i in data) {
							if (data[i].name === params) {
								return params + "：" + data[i].value;
							}
						}
					}
				},
				series: [
					{
						name: "性别分布",
						type: "pie", // 饼图
						radius: ["40%", "60%"], // 内外圆半径
						center: ["32%", "50%"], // 饼图中心坐标
						color: [
							"#ebb455",
							"#e74855"
						],
						avoidLabelOverlap: false, // 是否开启防止标签重叠
						label: {
							normal: {
								show: false,
								position: "outside"
							},
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.value
					}
				]
			};

			// 工龄分布
			this.woption = {
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: "vertical",
					top: "middle",
					right: "5%",
					itemWidth: 14,
					data: this.label,
					formatter: (params) => {
						let data = this.value;
						let total = 0;
						data.forEach(item => {
							total += item.value;
						});

						for (let i in data) {
							if (data[i].name === params) {
								return (params + "    "
										+ Math.round((data[i].value / total) * 10000) / 100.0
                                        + "%");
							}
						}
					}
				},
				series: [
					{
						name: "工龄分布",
						type: "pie",
						radius: ["40%", "60%"],
						center: ["25%", "50%"],
						avoidLabelOverlap: false,
						color: [
							"#388feb",
							"#5dbbd2",
							"#5db25d",
							"#ebb455",
							"#e74855",
							"#bcd163"
						],
						label: {
							normal: {
								show: false
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.value
					}
				]
			};

			// 年龄分布
			this.aoption = {
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: "vertical",
					top: "middle",
					right: "3%",
					itemWidth: 14,
					data: this.label,
					formatter: (params) => {
						let data = this.value;
						let total = 0;
						data.forEach(item => {
							total += item.value;
						});

						for (let i in data) {
							if (data[i].name === params) {
								return (params + "    "
										+ Math.round((data[i].value / total) * 10000) / 100.0
                                        + "%");
							}
						}
					}
				},
				series: [
					{
						name: "年龄分布",
						type: "pie",
						radius: ["40%", "60%"],
						center: ["26%", "50%"],
						avoidLabelOverlap: false,
						color: [
							"#388feb",
							"#5dbbd2",
							"#5db25d",
							"#ebb455",
							"#e74855",
							"#bcd163"
						],
						label: {
							normal: {
								show: false
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.value
					}
				]
			};

			// 员工类型分布
			this.toption = {
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: "vertical",
					top: "middle",
					right: "2%",
					itemWidth: 14,
					data: this.label,
					formatter: (params) => {
						let data = this.value;
						let total = 0;
						data.forEach(item => {
							total += item.value;
						});

						for (let i in data) {
							if (data[i].name === params) {
								return (params + "    "
										+ Math.round((data[i].value / total) * 10000) / 100.0
                                        + "%");
							}
						}
					}
				},
				series: [
					{
						name: "员工类型分布",
						type: "pie",
						radius: ["40%", "60%"],
						center: ["23%", "50%"],
						avoidLabelOverlap: false,
						color: [
							"#388feb",
							"#5dbbd2",
							"#5db25d",
							"#ebb455",
							"#e74855",
							"#bcd163"
						],
						label: {
							normal: {
								show: false
							}
						},
						data: this.value
					}
				]
			};

			// 籍贯统计图
			this.ooption = {
				tooltip: {
					show: true
				},
				grid: {
					left: "3%",
					right: "3%",
					bottom: "5%",
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: this.addressLabel,
					axisLabel: {
						rotate: 45
					}
				},
				yAxis: {
					type: "value",
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
