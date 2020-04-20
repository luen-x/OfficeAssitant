<template>
	<div class="v-distribute-sc">
		<h3>成交客户行业分布</h3>

		<div class="g-flex _distribute">
			<div :style="{width: width, height: height}">
				<vc-echarts 
					:options="bar"
					:auto-resize="true"
				/>
			</div>

			<div :style="{width: width}">
				<vc-echarts 
					:options="ring"
					:auto-resize="true"
				/>

				<p>当前成交客户</p>
			</div>
		</div>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	name: 'oa-success-customer', 

	components: {
		"vc-echarts": Echarts
	}, 

	props: {
		deal: Object
	},
    
	data() {
		let _this = this;

		return {
			title: '', // 成交客户总数
			total_num: '',
			bar: {
				color: ['#2397f9'],
				tooltip: {
				},
				xAxis: [
					{
						type: 'category',
						data: [],
						axisTick: {
							alignWithLabel: true
						}
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '',
						type: 'bar',
						barWidth: '20%',
						data: []
					}
				]
			},
			ring: {
				color: ['#2397F9', '#e8dc46', '#5dca4d', '#ec505b', '#ffb42b'],
			    tooltip: {
					trigger: 'item',
					formatter: (val) => {
						let arr = val.name.split(",");
						
						return arr[0] + "：" + arr[2];
					}
				},
				legend: {
					show: true, // 关闭悬浮提示
					orient: 'vertical',
					right: "6%", // 图例距离右侧距离
					top: "middle", // 图例垂直居中
					data: [],
					formatter: (name) => {
						let str = name.split(",");

						let arr = [
							'{a|' + str[0] + '}',
							'{b|' + str[1] + '}',
							'{c|' + str[2] + '}',
							'{d|' + str[3] + '}'
						];

						return arr.join(' ');
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "14",
								color: "#333333",
								width: 60
							},
							b: {
								color: "#d4d7db",
								height: 11
							},
							c: {
								fontSize: "16",
								color: "#333333",
								width: 50,
								padding: [0, 12, 0, 12]
							},
							d: {
								fontSize: "12",
								color: "#818794"
							}
						}
					}
				},
				series: [
					{
						name: '',
						type: 'pie',
						radius: ['40%', '60%'],
						center: ["28%", "50%"],
						avoidLabelOverlap: false,
						hoverAnimation: true, // 是否开启 hover 在扇形上的放大动画效果
						silent: false, // 图形是否不响应和触发鼠标事件，默认为false,即响应和触发鼠标事件
						label: {
							normal: {
								show: true,
								position: 'center',
								formatter() {
									let arr = [
										'{a|' + _this.total_num + '}',
										'{b|' + _this.title + '}'
									];

									return arr.join('\n');
								},
								textStyle: {
									rich: {
										a: {
											fontSize: "18",
											color: "#000000",
											height: "42",
											lineHeight: "42"
										},
										b: {
											fontSize: "12",
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
					}
				]
			},
			width: '50%',
			height: '90%'
		};
	},

	mounted() {
		this.deal.info.forEach(item => {
			this.bar.xAxis[0].data.push(item.title);
			this.bar.series[0].data.push(item.num);

			this.ring.legend.data.push({
				name: item.title + ",丨," + item.num + "人," + item.proportion,
				// 强制设置图形为圆。
				icon: 'circle'
			});

			this.ring.series[0].data.push({
				value: item.num,
				name: item.title + ",丨," + item.num + "人," + item.proportion
				// name: item.title
			});
		});

		this.title = this.deal.title;
		this.total_num = this.deal.total_num;
	}
};
</script>


<style lang="scss" scoped>
    .v-distribute-sc{
        height: 470px;
		border: 1px solid #ebeef1;

        &:hover{
			box-shadow: 0 0 7px 0 rgba(0,0,0,0.1);
		}

        h3{
            height: 50px;
            line-height: 50px;
            padding-left: 20px;
            font-size: 14px;
            color: #333333;
            background: #f8f8f8;
        }

        ._distribute{
            height: 100%;
            padding-top: 10px;

            div:nth-of-type(2){
                width: 100%;
                height: 85%;
                position: relative;
                padding-right: 2%;
                border-left: 1px dashed #ebeef1;

                p{
					width: 20%;
                    padding-right: 4%;
                    position: absolute;
                    margin-left: 23%;
                    font-size: 12px;
                    bottom: 6%;
					color: #333333;
                }
            }
        }
    }
</style>