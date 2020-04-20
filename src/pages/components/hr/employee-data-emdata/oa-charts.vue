
<template>
	<div>
		<div :style="{width: '100%', height: charts_id === 3 ? '254px' : '304px'}">
			<vc-echarts v-if="charts_id === 1" :options="ooption" :auto-resize="true" />
			<vc-echarts v-if="charts_id === 2" :options="loption" :auto-resize="true" />
			<vc-echarts v-if="charts_id === 3" :options="roption" :auto-resize="true" />
			<vc-echarts v-if="charts_id === 4" :options="toption" :auto-resize="true" />
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
		label: Array,
		data1: Array,
		data2: Array,
		width: String
	},
	data() {
		return {
			ooption: {},
			loption: {},
			roption: {},
			toption: {},
			reasonLabel: []
		};
	},
	watch: {
		// 监听数据变化
		data1() {
			let sum = [];
			this.charts_id === 3 ? this.reasonLabel = this.data1.map(item => item.name) : '';

			// 在职人员汇总
			this.ooption = {
				tooltip: {
					trigger: "axis"
				},
				grid: {
					left: "3%",
					right: "3%",
					bottom: "5%",
					containLabel: true
				},
				xAxis: [
					{
						type: "category",
						data: this.label,
						// axisLabel: {
						// 	rotate: 25
						// }
					}
				],
				yAxis: [
					{
						type: "value"
					}
				],
				series: [
					{
						name: "在职人数",
						type: "bar",
						barWidth: "32px",
						color: "#398eeb",
						data: this.data1,
						label: {
							normal: {
								show: true,
								position: "top"
							}
						}
					}
				]
			};

			// 离职人员汇总
			this.loption = {
				tooltip: {
					show: true
				},
				grid: {
					left: "3%",
					right: "3%",
					bottom: "5%",
					containLabel: true
				},
				xAxis: [
					{
						type: "category",
						data: this.label,
						// axisLabel: {
						// 	rotate: 45
						// }
					}
				],
				yAxis: [
					{
						type: "value"
					}
				],
				series: [
					{
						name: "入职人数",
						type: "bar",
						barWidth: "20px",
						color: "#58b0fa",
						data: this.data1,
						label: {
							normal: {
								show: true,
								position: "top"
							}
						}
					},
					{
						name: "离职人数",
						type: "bar",
						barWidth: "20px",
						color: "#398eeb",
						data: this.data2,
						label: {
							normal: {
								show: true,
								position: "top"
							}
						}
					}
				]
			};

			// 离职人员主因汇总
			this.roption = {
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: "vertical",
					top: "middle",
					left: 277,
					itemWidth: 14,
					data: this.reasonLabel,
					formatter: (params) => {
						let data = this.data1;
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
				// grid: {
				// 	width: '100%',
				// 	left: 80,
				// 	containLabel: true
				// },
				series: [
					{
						name: "离职人员主因汇总",
						type: "pie",
						labelLine: {
							show: false,
							length: 20,
							length2: 30
						},
						label: {
							show: false
							// normal: {
							// 	formatter: "{d|{d}%}\n{hr|}\n{b|{b}}",
							// 	rich: {
							// 		b: {
							// 			fontSize: 14,
							// 			align: "left",
							// 			padding: 5
							// 		},
							// 		hr: {
							// 			borderColor: "gray", // 标示线颜色
							// 			width: "100%",
							// 			borderWidth: 1,
							// 			height: 0
							// 		},
							// 		d: {
							// 			fontSize: 14,
							// 			align: "left",
							// 			padding: 5
							// 		}
							// 	}
							// }
						},
						radius: ["40%", "60%"],
						center: ["157", "50%"],
						color: [
							"#388feb",
							"#5dbbd2",
							"#5db25d",
							"#ebb455",
							"#e74855",
							"#bcd163"
						],
						data: this.data1,
						// itemStyle: {
						// 	emphasis: {
						// 		shadowBlur: 10,
						// 		shadowOffsetX: 0,
						// 		shadowColor: "rgba(0, 0, 0, 0.5)"
						// 	}
						// }
					}
				]
			};

			// 离职人员趋势图
			this.toption = {
				tooltip: {
					trigger: "axis"
				},
				grid: {
					left: "3%",
					right: "3%",
					bottom: "5%",
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: this.label,
					// axisLabel: {
					// 	rotate: 45
					// }
				},
				yAxis: {
					type: "value",
					axisLabel: {
						formatter: "{value}人"
					}
				},
				series: [
					{
						name: '离职人数',
						type: "line",
						data: this.data1,
						color: "#ff7800",
						symbol: "circle",
						symbolSize: 6,
						label: {
							show: true,
							color: "#000"
						}
					}
				]
			};
		}
	},
	mounted() {
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
</style>
