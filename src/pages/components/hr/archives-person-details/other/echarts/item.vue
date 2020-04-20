
<template>
	<div class="v-archives-person-details-other-echarts">
		<vc-echarts ref="echarts" :options="echartsInfo.ooption" :auto-resize="true" class="_echarts"/>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import API_ROOT from "@stores/apis/root";

export default {
	name: "oa-tpl",
	components: {
		"vc-echarts": Echarts
	},
	props: {
		echartsData: Object
	},
	data() {
		return {
			echartsInfo: { ooption: {} }
		};
	},
	watch: {
		echartsData() {
			this.handleProcessingData();
		}
	},
	mounted() {
		this.handleProcessingData();
	},
	methods: {
		handleProcessingData() {
			this.echartsInfo = {
				ooption: {
					title: {
						text: this.echartsData.data_arr[0].name,
						textStyle: {
							color: "#4B4F57", // 标题颜色
							fontSize: 16,
							lineHeight: 20
						},
						// 标题的位置，此时放在图的底边
						left: "center",
						top: "top"
					},
					tooltip: {
						confine: true,
						enterable: false // 鼠标是否可以移动到tooltip区域内
					},
					radar: [
						{
							splitNumber: 4,
							center: ['50%', '60%'],
							name: {
								textStyle: {
									color: "#818794",
									padding: [3, 5]
								}
							},
							splitArea: {
								show: false,
								areaStyle: {
									color: "rgba(255,0,0,0)" // 图表背景的颜色
								}
							},
							splitLine: {
								show: true,
								lineStyle: {
									width: 1,
									color: "#ccc" // 图表背景网格线的颜色
								}
							},
							indicator: this.echartsData.indicator_arr
						}
					],
					series: [
						{
							name: this.echartsData.data_arr[0].name,
							type: "radar",
							areaStyle: {
								normal: {
									opacity: 0.3
								}
							},
							label: {
								normal: {
									show: true,
									formatter(params) {
										return params.value;
									}
								}
							},
							lineStyle: {
								color: "rgb(255, 218 , 29)", // 图表中各个图区域的边框线颜色
								opacity: 0.5
							},
							data: this.echartsData.data_arr
						}
					]
				}
			};
		}
	}
};
</script>

<style lang="scss" >
.v-archives-person-details-other-echarts {
    width: 50%;
    float: left;
	._echarts{
		width: 200px;
		height: 200px;
	}
}
</style>
