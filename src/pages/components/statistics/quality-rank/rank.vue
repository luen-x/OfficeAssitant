<template>
	<div class="v-statistics-quality-rank">
		<div class="g-m-t-20">
			<div v-if="0">
				<div class="g-m-r-20 g-red-btn-line g-fr">导出</div>
			</div>
			<div>
				<i-date-picker
					v-model="start_time"
					:options="{disabledDate:startTimeDisable}"
					class="g-m-l-20"
					type="month"
					placeholder="开始时间"
					style="width: 220px"
					@on-change="handleStartTime"
				/>
				<i-date-picker
					v-model="end_time"
					:options="{disabledDate:endTimeDisable}"
					class="g-m-l-5"
					type="month"
					placeholder="结束时间"
					style="width: 220px"
					@on-change="handleEndTime"
				/>
				<i-select
					v-model="sort"
					class="g-m-l-5"
					clearable
					style="width: 220px"
					@on-change="loadingData()"
				>
					<i-option
						v-for="(item,index) in sortList"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					v-model="num"
					clearable
					style="width: 220px;margin-left:5px"
					@on-change="loadingData()"
				>
					<i-option
						v-for="(item,index) in numList"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-button
					type="primary"
					style="margin-left:5px"
					class="g-m-l-2"
					@click="loadingData"
				>搜索</i-button>
			</div>
		</div>
		<div class="_quailty g-m-20">
			<div class="__title">质检数量统计</div>
			<div class="g-m-20 __echarts">
				<div>质检客户数</div>
				<div
					v-if="option.xAxis.data.length>0"
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
				>
					<oa-echarts :options="option" :auto-resize="true"/>
				</div>
				<div
					v-else
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
					class="g-flex-cc g-flex-ac g-fd-c"
				>
					<img :src="OSS_SEARCH_EMPTY">
					<div class="g-tc">暂无数据，赶快添加一条吧~</div>
				</div>
			</div>
			<div class="g-m-20 __echarts">
				<div>8分以上数排名</div>
				<div
					v-if="option1.xAxis.data.length>0"
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
				>
					<oa-echarts :options="option1" :auto-resize="true"/>
				</div>
				<div
					v-else
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
					class="g-flex-cc g-flex-ac g-fd-c"
				>
					<img :src="OSS_SEARCH_EMPTY">
					<div class="g-tc">暂无数据，赶快添加一条吧~</div>
				</div>
			</div>
			<div class="g-m-20">
				<div>10分客户数</div>
				<div
					v-if="option2.xAxis.data.length>0"
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
				>
					<oa-echarts :options="option2" :auto-resize="true"/>
				</div>
				<div
					v-else
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
					class="g-flex-cc g-flex-ac g-fd-c"
				>
					<img :src="OSS_SEARCH_EMPTY">
					<div class="g-tc">暂无数据，赶快添加一条吧~</div>
				</div>
			</div>
			<div class="g-m-20">
				<div>雷区客户数排名</div>
				<div
					v-if="option3.xAxis.data.length>0"
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
				>
					<oa-echarts :options="option3" :auto-resize="true"/>
				</div>
				<div
					v-else
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
					class="g-flex-cc g-flex-ac g-fd-c"
				>
					<img :src="OSS_SEARCH_EMPTY">
					<div class="g-tc">暂无数据，赶快添加一条吧~</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Cascader, Select, Option } from 'iview';
import moment from 'moment';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { Echarts } from "wya-vc";
import API from "@stores/apis/root";

export default {
	name: 'oa-tpl',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'oa-echarts': Echarts
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			start_time: '', // 开始时间
			end_time: '', // 结束时间
			sort: '1', // 排名
			num: '1', // 显示前几名
			sortList: [
				{ label: '个人排名', value: '1' },
				{ label: '部门排名', value: '2' },
				{ label: '战区排名', value: '3' }
			],
			numList: [
				{ label: '前5名', value: '1' },
				{ label: '前10名', value: '2' },
				{ label: '前15名', value: '3' },
				{ label: '前20名', value: '4' }
			],
			option: {
				tooltip: {
					// trigger: 'axis',
					// axisPointer: { // 坐标轴指示器，坐标轴触发有效
					//  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					// }
				},
				grid: {
					bottom: '5%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					axisLabel: {
						rotate: 0
					}

				},
				yAxis: {
					type: 'value',
				},
				series: [{
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					type: 'bar',
					barWidth: 30,
					label: {
						show: true,
						position: 'top',
						color: '#333',
					},
					itemStyle: {
						normal: {
							color: '#2397f9'
						},

					},
				}]
			},
			option1: {
				grid: {
					bottom: '5%',
					containLabel: true
				},
				tooltip: {
					// trigger: 'axis',
					// axisPointer: { // 坐标轴指示器，坐标轴触发有效
					// 	type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					// }
					formatter: '{b0}: {c0}'
				},
				xAxis: {
					type: 'category',
					data: [],
					axisLabel: {
						rotate: 0
					}
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						formatter: '{value}',
					}
				},
				series: [{
					data: [],
					type: 'bar',
					barWidth: 30,
					label: {
						show: true,
						position: 'top',
						color: '#333',
						formatter: (params) => {
							return params.data.value + '个 (' + params.data.data + '%)';
						},

					},
					itemStyle: {
						normal: {
							color: '#2397f9'
						},

					},
				}]
			},
			option2: {
				grid: {
					bottom: '5%',
					containLabel: true
				},
				tooltip: {
					// trigger: 'axis',
					// axisPointer: { // 坐标轴指示器，坐标轴触发有效
					// 	type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					// }
					formatter: '{b0}: {c0}'
				},
				xAxis: {
					type: 'category',
					data: [],
					axisLabel: {
						rotate: 0
					}
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						formatter: '{value}',
					}
				},
				series: [{
					data: [],
					type: 'bar',
					barWidth: 30,
					label: {
						show: true,
						position: 'top',
						color: '#333',
						formatter: (params) => {
							return params.data.value;
						},
					},
					itemStyle: {
						normal: {
							color: '#2397f9'
						},
					},
				}]
			},
			option3: {
				grid: {
					bottom: '5%',
					containLabel: true
				},
				tooltip: {
					// trigger: 'axis',
					// axisPointer: { // 坐标轴指示器，坐标轴触发有效
					// 	// type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					// }
					formatter: '{b0}: {c0}'
				},
				xAxis: {
					type: 'category',
					data: [],
					axisLabel: {
						rotate: 0
					}
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						formatter: '{value}',
					}
				},
				series: [{
					data: [],
					type: 'bar',
					barWidth: 30,
					label: {
						show: true,
						position: 'top',
						color: '#333',
						formatter: (params) => {
							return params.data.value + '个 (' + params.data.data + '%)';
						},

					},
					itemStyle: {
						normal: {
							color: '#2397f9'
						},

					},
				}]
			},

		};
	},
	created() {
		this.loadingData();
	},
	methods: {
		handleStartTime(v) {
			this.start_time = v;
			this.loadingData();
		},
		handleEndTime(v) {
			this.end_time = v;
			this.loadingData();
		},
		startTimeDisable(date) {
			if (!this.end_time) {
				return false;
			}
			return !(moment(date).isAfter(moment(this.end_time).subtract(1, 'years')) && moment(date).isBefore(moment(this.end_time)));
		},
		endTimeDisable(date) {
			if (!this.start_time) {
				return false;
			}
			return !(moment(date).isBefore(moment(this.start_time).add(1, 'years')) && moment(date).isAfter(moment(this.start_time)));
		},

		loadingData() {
			this.$request({
				url: API.STATISTICS_QUEALITY_RANK_GET,
				type: "GET",
				loading: false,
				param: {
					start_time: this.start_time,
					end_time: this.end_time,
					sort: this.sort,
					num: this.num
				}
			}).then(res => {
				this.option.xAxis.data = res.data.Data1.name || [];
				this.option.series[0].data = res.data.Data1.data || [];
				if (res.data.Data1.data.length > 9) {
					this.option.xAxis.axisLabel.rotate = 45;
				} else {
					this.option.xAxis.axisLabel.rotate = 0;
				}

				this.option1.xAxis.data = res.data.Data2.name || [];
				this.option1.series[0].data = res.data.Data2.data || [];
				if (res.data.Data2.data.length > 9) {
					this.option1.xAxis.axisLabel.rotate = 45;
				} else {
					this.option1.xAxis.axisLabel.rotate = 0;
				}

				this.option2.xAxis.data = res.data.Data3.name || [];
				this.option2.series[0].data = res.data.Data3.data || [];
				if (res.data.Data3.data.length > 9) {
					this.option2.xAxis.axisLabel.rotate = 45;
				} else {
					this.option2.xAxis.axisLabel.rotate = 0;
				}

				this.option3.xAxis.data = res.data.Data4.name || [];
				this.option3.series[0].data = res.data.Data4.data || [];
				if (res.data.Data4.data.length > 9) {
					this.option3.xAxis.axisLabel.rotate = 45;
				} else {
					this.option3.xAxis.axisLabel.rotate = 0;
				}
			}).catch(err => {
			});
		}
	},
};
</script>

<style lang="scss" scoped>
    .v-statistics-quality-rank {
        ._quailty {
            border: 1px solid #ebeef1;
            border-radius: 4px;
            overflow: hidden;
            .__title {
                height: 50px;
                line-height: 50px;
                padding-left: 20px;
                font-size: 14px;
                color: #333333;
                background: #f8f8f8;
            }
            .__echarts {
                border-bottom: 1px solid #ebeef1;
            }
        }
        ._quailty:hover {
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
        }
    }
</style>
