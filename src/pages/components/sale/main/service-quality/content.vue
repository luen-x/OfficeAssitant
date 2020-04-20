<template>
	<div class="v-sale-main-service-quailty-content">
		<oa-block title="服务质检" @getDetail="handleMore">
			<vc-echarts
				:options="ring"
				:auto-resize="true"
				style="width:100%;height：300px"
			/>
		</oa-block>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";
import block from '../_common/block';

export default {
	components: {
		"oa-block": block,
		"vc-echarts": Echarts
	},
	data() {
		return {
			ring: {
				color: ['#FF8134', '#AEA658', '#70BCFC', '#F2AAAA', '#99C3B2'],
				legend: {
					// orient: 'vertical',
					 x: 'right',
					show: true, // 关闭悬浮提示
					orient: 'vertical',
					left: "40%", // 图例距离右侧距离
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
								width: 100
							},
							b: {
								color: "#d4d7db",
								height: 11
							},
							c: {
								fontSize: "16",
								color: "#333333",
								width: 53,
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
						left: "60",
						center: ["18%", "50%"],
						type: 'pie',
						radius: ['40%', '15%'],
						avoidLabelOverlap: false,
						label: {
							show: false,
							normal: {
								show: false,
								position: 'bottom'
							}, // 图例距离右侧距离
							emphasis: {
								show: false,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
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
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: "_SALE_MAIN_QUALITY_STATIC_SERVICE_GET",
				type: "GET",
				param: {}
			}).then(res => {
				const label = ['', '＜6分总数', '6≤x＜8分总数', '8≤x＜9分总数', '9≤x＜10分总数', '10分总数'];
				// this.ring.legend.data = ;
				if (res.data.length) {
					res.data.forEach(item => {
						this.ring.legend.data.push({
							name: label[item.score_step] + ",丨," + item.num + "个," + item.point + '%',
							// 	// 强制设置图形为圆。
							icon: 'circle'
						});
						this.ring.series[0].data.push({
							value: item.num,
							name: label[item.score_step] + ",丨," + item.num + "个," + item.point + '%'// 平均分
						});
					});
				}
			});
		},
		handleMore() {
			this.$router.push({ path: '/sale/main/service', query: { customer_type: "3" } });
		}
	}
};
</script>

<style lang="scss">
.v-sale-main-service-quailty-content{
	height: 400px;
}
</style>
