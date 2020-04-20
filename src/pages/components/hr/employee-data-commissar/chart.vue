
<template>
	<div>
		<div :style="{width: '100%', height: '352px'}" class="g-relative">
			<vc-echarts ref="charts" :options="option" :auto-resize="true" />
			<div
				class="g-absolute g-tc g-fs-16"
				style="pointer-events: none;padding-top: 100px;top: 0px;left: 0px;width: 100%; font-weight: 600;" >
				{{ count }}人
			</div>
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
		data: Array,
		count: Number,
		name: String,
		type: String
	},
	data() {
		return {
			option: {},
			color1: [
				"#398EEB", "#5EB25D", "#E74854", "#5DBAD3", "#EBB356", "#BDD064"
			],
			color2: [
				"#398EEB", "#EBB356", "#EAEA57", "#5DBAD3", "#E74854", "#EA7657",
				"#5EB25D", "#BDD064", "#4BE264"
			],
		};
	},
	watch: {
		// 监听数据变化
		data(newValue, oldValue) {
			if (newValue) {
				this.option = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						align: 'auto',
						top: 227,
						bottom: 10,
						itemWidth: 16,
						itemHeight: 16,
						textStyle: {
							rich: {
								a: {
									width: 150
								}
							}
						},
						formatter: (param) => {
							for (let item of newValue) {
								if (item.name === param) {
									return `{a| ${param} ${item.rate}}`;
								}
							}
						}
					},
					series: [
						{
							name: this.type === 'manage' ? '管理层数据统计表' : this.name,
							type: "pie", // 饼图
							radius: ["35%", "50%"], // 内外圆半径
							center: ["50%", "32%"], // 饼图中心坐标
							color: this.type === 'manage' ? this.color1 : this.color2,
							avoidLabelOverlap: false, // 是否开启防止标签重叠
							label: {
								show: false,
								position: "center",
								color: '#4B4F57',
								fontSize: 16,
								fontWeight: 400,
								fontFamily: 'MicrosoftYaHei',
								formatter: (param) => {
									return this.count + '人';
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: newValue
						}
					]
				};
			}
		}
	},
	mounted() {
		this.option = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				align: 'auto',
				top: 227,
				bottom: 10,
				itemWidth: 16,
				itemHeight: 16,
				textStyle: {
					rich: {
						a: {
							width: 150
						}
					}
				},
				formatter: (param) => {
					for (let item of this.data) {
						if (item.name === param) {
							return `{a| ${param} ${item.rate}}`;
						}
					}
				}
			},
			series: [
				{
					name: this.type === 'manage' ? '管理层数据统计表' : this.name,
					type: "pie", // 饼图
					radius: ["35%", "50%"], // 内外圆半径
					center: ["50%", "32%"], // 饼图中心坐标
					color: this.type === 'manage' ? this.color1 : this.color2,
					avoidLabelOverlap: false, // 是否开启防止标签重叠
					label: {
						show: false,
						position: "center",
						color: '#4B4F57',
						fontSize: 16,
						fontWeight: 400,
						fontFamily: 'MicrosoftYaHei',
						formatter: (param) => {
							return this.count + '人';
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: this.data
				}
			]
		};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
</style>
