<template>
	<div class="v-academy-statistics-course-trend-content">
		<div class="_title">开课效果趋势查看</div>
		<vc-echarts
			:options="ring"
			:auto-resize="true"
			style="height:600px;"
		/>
	</div>
</template>

<script>
import { Echarts } from "wya-vc";

const getToopTip = (param) => {
	const { seriesName, value, seriesIndex, color } = param;
	return `
		<div>
		<span style="display:inline-block;height:10px;width:10px;border-radius:5px;background:${color}"></span> 
		${seriesName}: ${value}${seriesIndex > 1 ? '%' : ''}
		</div>

	`;
};  

export default {
	name: 'oa-tpl',
	components: {
		"vc-echarts": Echarts
	},
	data() {
		return {
			ring: {
				color: ["#2397F9", "#EC505B", "#F49A58", "#5DCA4D"],
				dataZoom: {
					id: 'dataZoomX',
					type: 'slider',
					xAxisIndex: [0],
					filterMode: 'filter',
					width: '80%',
					left: "10%"
				},
				tooltip: {
					show: true,
					trigger: 'axis',
					formatter: (params, ticket) => {
						const { seriesName, name, value, seriesIndex } = params[0];
						const tootip = params.map(p => getToopTip(p)).join('');

						return `
							<div>${name}</div>
							${tootip}
						`;
					}
				},
				legend: {
					data: ['参与人数', '实际参与人数', '出勤率', '通关率'],
					itemWidth: 57,
					bottom: 80,
					itemGap: 78,
					orient: 'horizontal',
					// textStyle: {
					// 	color: ["#2397F9", "#EC505B", "#F49A58", "#5DCA4D"]
					// }
				},
				 grid: [{
					left: 50,
					right: 50,
					height: '60%',
					bottom: '150px',
				}],
				xAxis: [
					{
						type: 'category',
						data: ['1', '2', '3', '4', '5', '6', '7'],
						axisLine: {
							lineStyle: {
								color: '#D4D7DB'
							}
						},
						axisLabel: {
							color: '#4B4F57',
							formatter: (a, b) => {
								return b + 1;
							}
						},

					}
				],
				yAxis:
				[
					{
						type: 'value',
						color: "#2397F9",
						axisLine: {
							lineStyle: {
								color: '#fff'
							}
						},
						axisLabel: {
							color: '#4B4F57'
						},

					},
					{
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#fff'
							}
						},
						// eslint-disable-next-line no-dupe-keys
						axisLabel: {
							formatter: '{value}%',
							color: '#4B4F57'
						},

					}
				],
				series: [
					{
						name: '参与人数',
						data: [820, 932, 901, 934, 1290, 1330, 1320],
						type: 'line',
						yAxisIndex: [0],
						lineStyle: {
							color: "#2397F9"
						}
					},
					{
						name: '实际参与人数',
						data: [600, 760, 352, 123, 678, 999, 234],
						type: 'line',
						yAxisIndex: [0],
						lineStyle: {
							color: "#EC505B"
						}
					},
					{
						name: '出勤率',
						data: [23, 33, 33, 44, 55, 23, 43],
						type: 'line',
						yAxisIndex: [1],
						lineStyle: {
							color: "#F49A58"
						}
					},
					{
						name: '通关率',
						data: [12, 22, 19, 25, 25, 19, 38],
						type: 'line',
						yAxisIndex: [1],
						lineStyle: {
							color: "#5DCA4D"
						}
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
			const { query } = this.$route;
			this.$request({
				url: '_ACADEMY_TRAIN_CENTER_COURSE_STATISTIC_GET',
				type: "POST",
				param: {
					...query
				},
				loading: false
			}).then(res => {
				this.ring.series[0].data = res.data.course_participate_count;
				this.ring.series[1].data = res.data.course_attendance_count;
				this.ring.series[2].data = res.data.course_attendance_rate;
				this.ring.series[3].data = res.data.course_pass_rate;
				this.ring.xAxis[0].data = res.data.course.map((ele, i) => ele.course_name);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss">
.v-academy-statistics-course-trend-content{
	border:1px solid rgba(212, 215, 219, 1);
	margin: 20px;
	._title{
		height: 52px;
		line-height: 52px;
		padding-left: 20px;
		background: #fafafa;
	}
}
</style>
