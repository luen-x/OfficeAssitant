<template>
	<div class="g-relative" style="width: 100%;height: 360px;">
		<vc-echarts ref="_charts" :options="option" :auto-resize="true" />
		<div
			:style="{left: '50%', transform: 'translateX(-32px)'}"
			class="g-absolute g-fs-16"
			style="pointer-events: none;padding-top: 134px;top: 0px;font-weight: bold;">
			{{ name }}
		</div>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

export default {
	name: 'oa-table',
	components: {
		'vc-echarts': Echarts
	},
	props: {
		data: Array,
		name: String,
		type: String
	},
	data() {
		return {
			option: {}
		};
	},
	watch: {
		data() {
			let color1 = ["#398EEB", "#5DBAD3", "#5EB25D", "#E74854", "#EBB356", "#BDD064"];
			let color2 = ["#398EEB", "#5DBAD3", "#5EB25D", "#EBB356", "#EA6F57", "#E74854", "#BDD064"];
			this.option = {
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					align: 'auto',
					top: 280,
					itemGap: 15,
					itemWidth: 16,
					itemHeight: 16,
					textStyle: {
						rich: {
							a: {
								width: this.type === 'try' ? 140 : 100
							}
						}
					},
					formatter: '{a|{name}}'
				},
				series: [
					{
						name: this.name,
						type: "pie", // 饼图
						radius: ["40%", "60%"], // 内外圆半径
						center: ["50%", "40%"], // 饼图中心坐标
						color: this.type === 'try' ? color1 : color2,
						avoidLabelOverlap: false, // 是否开启防止标签重叠
						label: {
							show: false,
							position: "center",
							color: '#4B4F57',
							fontSize: 16,
							fontWeight: 400,
							fontFamily: 'MicrosoftYaHei',
							formatter: (param) => {
								return this.name;
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.name === '职能部门' ? this.data[0] : this.data[1]
					}
				]
			};
		}
	}
};
</script>

<style lang='scss' scoped>
</style>