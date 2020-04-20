<template>
	<div class="g-flex">
		<div class="g-relative" style="width: 50%;height: 350px;">
			<div class="g-fs-14 g-c-black g-pd-t-25 g-absolute" style="margin-left: 12%;">
				客户不满意原因统计
			</div>

			<vc-echarts 
				:options="customDissatisfied"
				:auto-resize="true"
			/>
		</div>
		<div class="g-relative" style="width: 50%;height: 350px;">
			<div class="g-fs-14 g-c-black g-pd-t-25 g-absolute" style="margin-left: 15%;">
				具体原因统计
			</div>

			<vc-echarts 
				:options="specificDissatisfied"
				:auto-resize="true"
			/>
		</div>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	components: {
		"vc-echarts": Echarts
	},
    
	data() {
		return {
			customDissatisfied: {
				color: ['#2E9DFA', '#FFB42B', '#5DCA4D'],
			    tooltip: {
					trigger: 'item',
					formatter: (val) => {
						let arr = val.name.split(",");
	
						return arr[0] + "：" + arr[1] + "     " + arr[2];
					}
				},
				legend: {
					show: true, // 关闭悬浮提示
					orient: 'vertical',
					right: "9%", // 图例距离右侧距离
					top: "middle", // 图例垂直居中
					data: [],
					formatter: (name) => {
						let str = name.split(",");
						let arr = [];

						arr = [
							[`{a|${str[0]}}`],
							`{b|${'|'}}`,
							`{c|${str[1]}}`,
							`{d|${str[2]}}`
						];

						return arr.join(' ');
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "12",
								color: "#333333",
								width: 100,
								padding: [0, 20, 0, 0]
							},
							b: {
								fontSize: "12",
								color: "#E8E8E8",
								width: 20
							},
							c: {
								fontSize: "13",
								color: "#333333",
								width: 60
							},
							d: {
								fontSize: "12",
								color: "#818794"
							}
						}
					}
				},
				series: [{
					name: '',
					type: 'pie',
					radius: ['40%', '60%'],
					center: ["20%", "50%"],
					avoidLabelOverlap: false,
					hoverAnimation: true, // 是否开启 hover 在扇形上的放大动画效果
					silent: false, // 图形是否不响应和触发鼠标事件，默认为false,即响应和触发鼠标事件
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: false,
							position: 'center'
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: []
				}]
			},
			specificDissatisfied: {
				color: ['#2E9DFA', '#FFB42B', '#5DCA4D', '#EC505B', 
					'#8453C8', '#E3FF49', '#ED870E', '#D50EED', '#F95522', '#0EC0ED', '#0EED87', '#EC22B5'],
			    tooltip: {
					trigger: 'item',
					formatter: (val) => {
						let arr = val.name.split(",");
	
						return arr[0] + "：" + arr[1] + "     " + arr[2];
					}
				},
				legend: {
					show: true, // 关闭悬浮提示
					orient: 'vertical',
					right: "9%", // 图例距离右侧距离
					top: "middle", // 图例垂直居中
					data: [],
					formatter: (name) => {
						let str = name.split(",");
						let arr = [];

						arr = [
							[`{a|${str[0]}}`],
							`{b|${'|'}}`,
							`{c|${str[1]}}`,
							`{d|${str[2]}}`
						];

						return arr.join(' ');
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "12",
								color: "#333333",
								width: 100,
								padding: [0, 20, 0, 0]
							},
							b: {
								fontSize: "12",
								color: "#E8E8E8",
								width: 20
							},
							c: {
								fontSize: "13",
								color: "#333333",
								width: 60
							},
							d: {
								fontSize: "12",
								color: "#818794"
							}
						}
					}
				},
				series: [{
					name: '',
					type: 'pie',
					radius: ['40%', '60%'],
					center: ["20%", "50%"],
					avoidLabelOverlap: false,
					hoverAnimation: true, // 是否开启 hover 在扇形上的放大动画效果
					silent: false, // 图形是否不响应和触发鼠标事件，默认为false,即响应和触发鼠标事件
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: false,
							position: 'center'
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: []
				}]
			}
		};
	},
    
	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.$request({
				url: "_SC_MANAGE_STATISTICS_HATE_REASON",
				type: "GET",
				param: {}
			}).then(res => {
				res.data.hate_type_static.forEach(item => {
					this.customDissatisfied.legend.data.push({
						name: item.name + "," + item.num + '次,' + item.point + "%",
						// 强制设置图形为圆。
						icon: 'circle'
					});

					this.customDissatisfied.series[0].data.push({
						value: item.num,
						name: item.name + "," + item.num + '次,' + item.point + "%"
					});
				});

				res.data.hate_reason_static.forEach(item => {
					this.specificDissatisfied.legend.data.push({
						name: item.name + "," + item.num + '次,' + item.point + "%",
						// 强制设置图形为圆。
						icon: 'circle'
					});

					this.specificDissatisfied.series[0].data.push({
						value: item.num,
						name: item.name + "," + item.num + '次,' + item.point + "%"
					});
				});
			});
		}
	}
};
</script>

<style lang="scss">
</style>