<template>
	<div style="width: 100%;height: 360px;">
		<vc-echarts :options="option" :auto-resize="true" />
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
		data: Object,
		name: String
	},
	data() {
		return {
			option: {}
		};
	},
	watch: {
		'data.try_count': {
			handler() {
				this.option = {
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						orient: 'vertical',
						top: '15%',
						right: `${this.name === 'recruit' ? '30%' : '15%'}`,
						itemWidth: 10,
						itemHeight: 10,
						itemGap: 30,
						textStyle: {
							color: '#818794',
							fontSize: 14,
							fontWeight: 400,
							fontFamily: 'MicrosoftYaHei'
						},
						data: ['试岗人数', '试岗流失人数', '入职流失人数', '入职人数', '入职在职人数'],
						formatter(name) {
							return '  ' + name;
						}
					},
					grid: {
						width: `${this.name === 'recruit' ? '50%' : '70%'}`,
						left: 50,
						top: 30,
						bottom: 30,
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							data: this.data.label,
							axisLabel: {
								// rotate: 45
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
							name: '试岗人数',
							type: 'bar',
							barWidth: '16px',
							color: '#2E9DFA',
							data: this.data.try_count,
						},
						{
							name: '试岗流失人数',
							type: 'bar',
							barWidth: '16px',
							color: '#EC505B',
							data: this.data.try_pass_count,
						},
						{
							name: '入职流失人数',
							type: 'bar',
							barWidth: '16px',
							color: '#ED8F4A',
							data: this.data.leave_count,
						},
						{
							name: '入职人数',
							type: 'bar',
							barWidth: '16px',
							color: '#EDE34A',
							data: this.data.entry_and_leave_count,
						},
						{
							name: '入职在职人数',
							type: 'bar',
							barWidth: '16px',
							color: '#4FC43D',
							data: this.data.entry_count,
						}
					]
				};
			}
		}
	}
};
</script>

<style lang='scss' scoped>
</style>