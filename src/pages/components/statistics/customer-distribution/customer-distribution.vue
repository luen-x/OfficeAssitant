<template>
	<div class="v-distribute-cd">
		<div class="_distribute">
			<div :style="{width: width, height: height}" class="_dis">
				<h3>客户分布统计</h3>
				<vc-echarts 
					:options="bar"
					:auto-resize="true"
				/>
			</div>

			<div :style="{width: a, height: height}" class="_dis">
				<h3>未成交客户行业分布</h3>
				<vc-echarts 
					:options="ring"
					:auto-resize="true"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: 'oa-success-customer', 

	components: {
		"vc-echarts": Echarts
	}, 

	props: {
		noDeal: Object
	},
    
	data() {
		let _this = this;

		return {
			a: "49%",
			title: '',
			total_num: '',
			bartitle: '',
			bartotal_num: '',
			bar: {
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
					right: "9%", // 图例距离右侧距离
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
								width: 70
							},
							b: {
								color: "#d4d7db",
								height: 11
							},
							c: {
								fontSize: "16",
								color: "#333333",
								width: 60,
								padding: [0, 12, 0, 12]
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
					radius: ['38%', '56%'],
					center: ["24%", "50%"],
					avoidLabelOverlap: false,
					hoverAnimation: true, // 是否开启 hover 在扇形上的放大动画效果
					silent: false, // 图形是否不响应和触发鼠标事件，默认为false,即响应和触发鼠标事件
					label: {
						normal: {
							show: true,
							position: 'center',
							formatter() {
								let arr = [
									'{a|' + _this.bartotal_num + '}',
									'{b|' + _this.bartitle + '}'
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
				}]
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
					right: "9%", // 图例距离右侧距离
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
								width: 60,
								padding: [0, 12, 0, 12]
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
					radius: ['38%', '56%'],
					center: ["25.4%", "50%"],
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
				}]
			},
			width: '49.5%',
			height: '100%'
		};
	},

	mounted() {
		this.noDeal.info.forEach(item => {
			this.ring.legend.data.push({
				name: item.title + ",丨," + item.num + "人," + item.proportion,
				// 强制设置图形为圆。
				icon: 'circle'
			});

			this.ring.series[0].data.push({
				value: item.num,
				name: item.title + ",丨," + item.num + "人," + item.proportion
			});
		});

		this.title = this.noDeal.title;
		this.total_num = this.noDeal.total_num;

		this.handleGetData();
	},

	
	methods: {
		handleGetData() {
			this.$request({
				url: API_ROOT.STATISTICS_CUSTOMER_DISTRIBUTIONS_GET,
				type: "GET",
				param: {}
			}).then(res => {
				res.data.distribution.forEach(item => {
					this.bar.legend.data.push({
						name: item.title + ",丨," + item.num + "人," + item.proportion,
						// 强制设置图形为圆。
						icon: 'circle'
					});

					this.bar.series[0].data.push({
						value: item.num,
						name: item.title + ",丨," + item.num + "人," + item.proportion
					});
				});

				this.bartitle = res.data.title;
				this.bartotal_num = res.data.total_num;
			}).catch(error => {});
		}
	}
};
</script>


<style lang="scss" scoped>
    .v-distribute-cd{
        height: 470px;

        ._distribute{
            width: 100%;
            height: 470px;
            padding-bottom: 30px;
            display: flex;
            justify-content: space-between;
            box-sizing:border-box;

            div:nth-of-type(1){
                margin-right: 20px;
            }

            div:nth-of-type(1), div:nth-of-type(2){
                h3{
                    height: 50px;
                    line-height: 50px;
                    padding-left: 20px;
                    font-size: 14px;
                    color: #333333;
                    background: #f8f8f8;
                }
            }

			._dis{
				border: 1px solid #ebeef1;

				&:hover{
					box-shadow: 0 0 7px 0 rgba(0,0,0,0.1);
				}
			}
        }

        .vc-echarts{
            height: 88.5% !important;
        }
    }
</style>