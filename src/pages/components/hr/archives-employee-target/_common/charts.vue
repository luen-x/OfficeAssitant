<template>
	<div style="width: 100%;height: 270px;">
		<vc-echarts ref="_charts" :options="option" :auto-resize="true" />
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	name: 'oa-table',
	components: {
		'vc-echarts': Echarts
	},
	props: {
		data: Object,
		name: String
	},
	data() {
		return {
			option: {}
		};
	},
	watch: {
		'data': {
			deep: true,
			handler(newV, oldV) {
				let list = [];
				list.splice(0, 0, {
					name: '挂蛋人数',
					value: newV.no_achievement
				}, {
					name: '未挂蛋人数',
					value: newV.get_achievement
				});

				this.option = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						align: 'auto',
						bottom: '5%',
						itemWidth: 16,
						itemHeight: 16,
						formatter: (name) => {
							let i = list.findIndex(item => item.name === name);
							if (i !== -1) {
								return name + '：' + (i === 0 ? list[0].value : list[1].value) + '人'
										 + '    ' + (i === 0 ? this.data.no_achievement_percentage : this.data.get_achievement_percentage);
							}
						}
					},
					series: [
						{
							name: '数据统计',
							type: "pie", // 饼图
							radius: ["45%", "65%"], // 内外圆半径
							center: ["50%", "40%"], // 饼图中心坐标
							color: ["#5CCB4C", "#2297F9"],
							avoidLabelOverlap: false, // 是否开启防止标签重叠
							label: {
								show: false
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: list
						}
					]
				};
			},
		}
	},
	mounted() {
		let list = [];
		list.splice(0, 0, {
			name: '挂蛋人数',
			value: this.data.no_achievement
		}, {
			name: '未挂蛋人数',
			value: this.data.get_achievement
		});

		this.option = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				align: 'auto',
				bottom: '5%',
				itemWidth: 16,
				itemHeight: 16,
				formatter: (name) => {
					let i = list.findIndex(item => item.name === name);
					if (i !== -1) {
						return name + '：' + (i === 0 ? list[0].value : list[1].value) + '人'
										 + '    ' + (i === 0 ? this.data.no_achievement_percentage : this.data.get_achievement_percentage);
					}
				}
			},
			series: [
				{
					name: '数据统计',
					type: "pie", // 饼图
					radius: ["45%", "65%"], // 内外圆半径
					center: ["50%", "40%"], // 饼图中心坐标
					color: ["#5CCB4C", "#2297F9"],
					avoidLabelOverlap: false, // 是否开启防止标签重叠
					label: {
						show: false
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: list
				}
			]
		};
	},
	methods: {
	}
};
</script>

<style lang='scss' scoped>

</style>


