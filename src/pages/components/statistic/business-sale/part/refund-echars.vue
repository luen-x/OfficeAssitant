<template>
	<vc-echarts 
		:options="options"
		auto-resize
		style="height: 250px;"
	/>
</template>

<script>
import { Echarts } from "wya-vc";
import { getFormatNum } from '@utils/utils';

export default {
	components: {
		'vc-echarts': Echarts
	},
	props: {
		dataSource: {
			type: Array
		}
	},
	data() {
		return {
			color: ['#5DCA4D', '#FFB42B', '#2E9DFA', '#EC505B', '#8453C8', '#4DCAA2', '#4AB9FF', 
				'#FF5858', '#FFDF2B', '#3C65FF', '#FF4BDF', '#BF6BFF', '#7FE8FF', '#FF6E0E',
				'#7898DA', '#8FFFD2', '#9FACC9', '#C9F616', '#BDAC79', '#FFB7A6', '#6DC8EC',
				'#9270CA', '#646464', '#FF99C3', '#269A99', '#FF9D4D', '#8F857D', '#7A9FAE',
				'#5D7092', '#AAD8D8'],
			options: {
				color: [],
			    tooltip: {
					trigger: 'item',
					formatter: (value) => {
						let arr = value.name.split(",");
	
						return arr[0] + ' ' + value.data.total_refund_amount + '元 ' + arr[1] + ' ';
					}
				},
				legend: {
					show: true, // 关闭悬浮提示
					orient: 'vertical',
					right: "35%", // 图例距离右侧距离
					top: "middle", // 图例垂直居中
					data: [],
					formatter: (name) => {
						let str = name.split(",");
						let arr = [];

						arr = [
							[`{a|${str[0]}}`],
							`{b|${str[1]}}`
						];

						return arr.join(' ');
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "12",
								color: "#333333"
							},
							b: {
								fontSize: "12",
								color: "#333333"
							}
						}
					}
				},
				series: [{
					name: '',
					type: 'pie',
					radius: ['48%', '60%'],
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
	watch: {
		dataSource(value) {
			this.handleData(value);
		}
	},
	mounted() {
		this.handleData(this.dataSource);
	},
	methods: {
		handleData(data) {
			this.options.color = [];
			this.options.series[0].data = [];
			this.options.legend.data = [];

			data.forEach((item, index) => {
				this.options.series[0].data.push({
					value: getFormatNum(item.ratio, 2),
					name: `${item.name}：,${getFormatNum(item.ratio, 2, '', '%')}`,
					total_refund_amount: getFormatNum(item.total_refund_amount, 2)
				});

				this.options.legend.data.push({
					name: `${item.name}：,${getFormatNum(item.ratio, 2, '', '%')}`,
					icon: 'circle'
				});

				if (index < 30) {
					this.options.color = this.color;
				} else {
					this.options.color.push(this.randomRgbColor());
				}
			});
		},
		randomRgbColor() {
			return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
		}
	}
};
</script>