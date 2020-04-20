<template>
	<div style="width: 240px; height: 240px;margin-top: 94px;">
		<vc-echarts 
			:options="ring"
			:auto-resize="true"
		/>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	name: "collage-method-ring-echars",

	components: {
		"vc-echarts": Echarts
	},
    
	props: {
		content: Object,
		total_data: Object
	},
    
	data() {
		return {
			ring: {
				color: [],
			    tooltip: {
					show: false,
					trigger: 'item',
					formatter: (val) => {
						let arr = val.name.split(",");
						return arr[0] + " | " + arr[1] + "/" + arr[2];
					}
				},
				legend: {
					show: false, // 关闭悬浮提示
					orient: 'vertical',
					right: "15%", // 图例距离右侧距离
					top: "middle", // 图例垂直居中
					data: []
				},
				series: [{
					name: '',
					type: 'pie',
					radius: ['40%', '60%'],
					center: ["50%", "50%"],
					avoidLabelOverlap: false,
					hoverAnimation: true, // 是否开启 hover 在扇形上的放大动画效果
					silent: false, // 图形是否不响应和触发鼠标事件，默认为false,即响应和触发鼠标事件
					label: {
						normal: {
							show: true,
							position: 'center',
							formatter(v) {
								if (v.name.split(',')[0] == ' ') {
									return "";
								}

								let arr = [
									`{a|${v.name.split(',')[0]}}`,
									`{b|${v.name.split(',')[1]}}`
								];
                                
								return arr.join('\n');
							},
							textStyle: {
								rich: {
									a: {
										fontSize: "16",
										color: "#000000",
										height: "30",
										lineHeight: "30"
									},
									b: {
										fontSize: "14",
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
			},
			width: '90%',
			height: '100%'
		};
	},
    
	mounted() {
		this.ring.color = [this.content.color, "#5DCA4D"];
        
		let arr = [{
			name: this.content.name,
			percent: this.total_data.point
		}, {
			name: " ",
			percent: 100 - Number(this.total_data.point) + ""
		}];

		arr.forEach(item => {
			this.ring.legend.data.push({
				name: item.name + "," + item.percent + "%",
				// 强制设置图形为圆。
				icon: 'circle'
			});

			this.ring.series[0].data.push({
				value: +item.percent,
				name: item.name + "," + item.percent + "%",
			});
		});
	}
};
</script>

<style lang="scss">
</style>