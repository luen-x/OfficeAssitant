
<template>
	<div class="v-hr-archives-achie-trend-bar g-flex g-flex-ac g-flex-cc">
		<vc-echarts 
			v-if="status"
			ref="echarts"
			:options="ooption" 
			:auto-resize="true"
			class="g-m-t-10"
			style="height:354px"
		/>
		<div
			v-else
			class="_norank g-flex g-fd-c g-jc-c g-ai-c g-m-t-10">
			<img :src="norankUrl">
			<span style="marginTop:-20px">输入员工姓名查看其排名情况</span>
		</div>
		
	</div>
</template>

<script>

import {
	Echarts
} from "wya-vc";
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import { OSS_INVOICE_EMPTY } from '@constants/constants';
	
export default {
	name: "oa-tpl",
	components: {
		"vc-echarts": Echarts,
	},
	props: {
		value: null
	},
	data() {
		return {
			status: false,
			sectionArr: [],
			departArr: [],
			allArr: [],
			ooption: {},
			norankUrl: OSS_INVOICE_EMPTY,
			echartsData: {
				depart_name: '',
				ooption: {
					legend: {},
					xAxis: {},
					yAxis: {},
					series: []
				}
			}
			,
		};
	},
	watch: {
		value() {
			this.handleProcessingData();
		}
	},
	mounted() {
		this.handleProcessingData();
	},
	methods: {
		handleProcessingData(data) {
			if (this.value.detail && this.value.detail.length) {
				this.status = true;
				this.sectionArr = [];
				this.departArr = [];
				this.allArr = [];
				this.value.detail.map(item => {
					this.sectionArr.push(item.section);
					this.departArr.push(item.depart);
					this.allArr.push(item.all);
					return; 
				});
			}
			
			let newArr = [];
			this.ooption = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				color: ['#FC6B28', '#9E9746', '#8EB6AE'],
				legend: {
					data: ['部门排名', '战区排名', '公司排名'],
					orient: "vertical",
					top: "middle",
					right: "3%",
					containLabel: true,
				},
				grid: {
					left: "3%",
					right: "10%",
					bottom: "5%",
					containLabel: true
				},
				calculable: true,
				xAxis: [
					{
						type: 'category',
						axisTick: { show: false },
						data: this.value.month
					}
				],
				yAxis: [
					{
						type: 'value',
						minInterval: 1,
					}
				],
				series: [
					{
						name: '部门排名',
						type: 'bar',
						data: this.departArr
					},
					{
						name: '战区排名',
						type: 'bar',
						barGap: 0,
						data: this.sectionArr
					},
					{
						name: '公司排名',
						type: 'bar',
						data: this.allArr
					}
				]
			};
			
			
		},
	}
};
</script>

<style lang="scss" >
.v-hr-archives-achie-trend-bar{
	._norank {
		height: 300px;
		img {
			margin-bottom: 50px;
		}
	}
}
</style>
