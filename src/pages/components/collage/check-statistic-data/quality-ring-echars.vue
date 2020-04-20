<template>
	<div style=" height: 350px;margin-top: 54px;">
		<vc-echarts 
			:options="ring"
			:auto-resize="true"
		/>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	name: "collage-quality-ring-echars",

	components: {
		"vc-echarts": Echarts
	},

	props: {
		quality_lesson_count: Object
	},
    
	data() {
		return {
			quality_ring_data: [],
			ring: {
				color: ['#5DCA4D', '#FFB42B'],
			    tooltip: {
					trigger: 'item',
					formatter: (val) => {
						let arr = val.name.split(",");
						return arr[0] + " | " + arr[1] + "/" + arr[2];
					}
				},
				legend: {
					show: true, // 关闭悬浮提示
					orient: 'vertical',
					right: "15%", // 图例距离右侧距离
					top: "middle", // 图例垂直居中
					data: [],
					formatter: (name) => {
						let str = name.split(",");
						let arr = [];
                        
						arr = [
							`{a|${str[0]}}`,
							`{b|${'|'}}`,
							`{c|${str[1]}/}`,
							`{d|${str[2]}}`
						];

						return arr.join(' ');
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "12",
								color: "#333333",
								width: 60,
								padding: [0, 20, 0, 0]
							},
							b: {
								fontSize: "12",
								color: "#E8E8E8",
								width: 20
							},
							c: {
								fontSize: "13",
								color: "#333333"
							},
							d: {
								fontSize: "13",
								color: "#333333"
							}
						}
					}
				},
				series: [{
					name: '',
					type: 'pie',
					radius: ['40%', '55%'],
					center: ["20%", "50%"],
					avoidLabelOverlap: false,
					hoverAnimation: true, // 是否开启 hover 在扇形上的放大动画效果
					silent: false, // 图形是否不响应和触发鼠标事件，默认为false,即响应和触发鼠标事件
					label: {
						normal: {
							show: false,
							position: 'center',
							formatter() {
								return " ";
							},
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
			},
			width: '90%',
			height: '100%'
		};
	},
    
	mounted() {
		this.quality_ring_data = [
			{ 
				title: "待质检客户数", 
				num1: this.quality_lesson_count.wait_quality_count, 
				num2: this.quality_lesson_count.need_quality_lesson_count 
			},
			{ 
				title: "已质检客户数", 
				num1: this.quality_lesson_count.has_quality_count, 
				num2: this.quality_lesson_count.has_quality_lesson_count
			}
		];
		this.quality_ring_data.forEach(item => {
			this.ring.legend.data.push({
				name: item.title + "," + item.num1 + "人," + item.num2 + "套",
				// 强制设置图形为圆。
				icon: 'circle'
			});

			this.ring.series[0].data.push({
				value: item.num1,
				name: item.title + "," + item.num1 + "人," + item.num2 + "套",
			});
		});
	}
};
</script>

<style lang="scss">
</style>