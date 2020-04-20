<template>
	<div class="v-distribute-sc">
		<h3>沉积客户统计</h3>

		<div class="g-flex _distribute">
			<div :style="{width: width}">
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
    
	data() {
		return {
			ring: {
				color: ['#2397F9', '#e8dc46', '#5dca4d', '#ec505b', '#ffb42b'],
			    tooltip: {
					trigger: 'item',
					formatter: (val) => {
						let arr = val.name.split(",");
						
						return arr[0] + "：" + arr[1];
					}
				},
				legend: {
					show: true, // 关闭悬浮提示
					orient: 'vertical',
					right: "2%", // 图例距离右侧距离
					top: "middle", // 图例垂直居中
					data: [],
					formatter: (name) => {
						let str = name.split(",");

						let arr = [
							'{a|' + str[0] + '}',
							'{b|' + str[1] + '}'
						];

						return arr.join(' ');
					},
					textStyle: {
						rich: {
							a: {
								fontSize: "14",
								color: "#333333",
								width: 80
							},
							b: {
								fontSize: "16",
								color: "#333333",
								width: 60,
								padding: [0, 12, 0, 12]
							}
						}
					}
				},
				series: [{
					name: '',
					type: 'pie',
					radius: ['34%', '50%'],
					center: ["30%", "50%"],
					avoidLabelOverlap: false,
					hoverAnimation: true, // 是否开启 hover 在扇形上的放大动画效果
					silent: false, // 图形是否不响应和触发鼠标事件，默认为false,即响应和触发鼠标事件
					label: {
						normal: {
							show: true,
							position: 'center',
							formatter() {
								return "";
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
		this.handleGetData();
	},

	methods: {
		handleGetData() {
			this.$request({
				url: API_ROOT.STATISTICS_CUSTOMER_SEDIMENTARY_GET,
				type: "GET",
				param: {}
			}).then(res => {
				res.data.forEach(item => {
					this.ring.legend.data.push({
						name: item.title + "," + item.num + "人",
						// 强制设置图形为圆。
						icon: 'circle'
					});

					this.ring.series[0].data.push({
						value: item.num,
						name: item.title + "," + item.num + "人"
					});
				});
			}).catch(error => {});
		}
	}
};
</script>


<style lang="scss" scoped>
    .v-distribute-sc{
        width: 50%;
        height: 500px;
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
            padding-bottom: 52px;

            div:nth-of-type(1){
                width: 100%;
                position: relative;
                border-left: 1px dashed #ebeef1;
            }
        }
    }
</style>