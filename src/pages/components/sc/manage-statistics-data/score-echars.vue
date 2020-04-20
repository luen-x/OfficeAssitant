<template>
	<div style="width: 100%;height: 340px;">
		<vc-echarts
			:options="ring"
			:auto-resize="true"
		/>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	components: {
		"vc-echarts": Echarts
	},

	props: {
		service: Array,
		average: Number
	},
    
	data() {
		return {
			ring: {
				color: ['#2E9DFA', '#FFB42B', '#5DCA4D', '#EC505B', '#8453C8'],
			    tooltip: {
					trigger: 'item',
					formatter: (val) => {
						let arr = val.name.split(",");
	
						return ["＜6分总数   |    ", "6≤x＜8分总数  |    ", "8≤x＜9分总数  |    ", "9≤x＜10分总数  |    ", "10分总数  |    "][arr[0] - 1]
						+ arr[1] + "     " + arr[2];
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
							["{a|＜6分总数}", "{a|6≤x＜8分总数}", "{a|8≤x＜9分总数}", "{a|9≤x＜10分总数}", "{a|10分总数}"][str[0] - 1],
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
							show: true,
							position: 'center',
							formatter(v) {
								let arr = [
									'{a|平均分}',
									`{b|${(+v.name.split(",")[3]).toFixed(2)}}`
								];

								return arr.join('\n');
							},
							textStyle: {
								rich: {
									a: {
										fontSize: "20",
										color: "#000000",
										height: "42",
										lineHeight: "42"
									},
									b: {
										fontSize: "20",
										color: '#333333'
									}
								}
							}
						},
						emphasis: {
							show: true,
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
		this.service.forEach(item => {
			this.ring.legend.data.push({
				name: item.score_step + "," + item.num + '次,' + item.point + "%," + this.average,
				// 强制设置图形为圆。
				icon: 'circle'
			});

			this.ring.series[0].data.push({
				value: item.num,
				name: item.score_step + "," + item.num + '次,' + item.point + "%," + this.average // 平均分
			});
		});
	}
};
</script>

<style lang="scss">
</style>