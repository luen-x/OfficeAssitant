<template>
	<div class="v-statistics-quality-data">
		<div class="g-pd-20 g-flex g-jc-sb g-ai-fs _head">
			<div class="g-lh-42">
				<i-input
					v-model.trim="keywords.search"
					clearable
					placeholder="请输入员工姓名/手机号"
					class="g-m-r-5"
					style="width:220px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-cascader
					v-if="departAll.length"
					v-model="keywords.depart_ids"
					:data="departAll"
					clearable
					change-on-select
					placeholder="请选择组织"
					class="g-m-r-5"
					style="width:220px"
					@on-change="handleSearch"
				/>
				<i-date-picker
					v-model="keywords.start_time"
					:options="{disabledDate:startTimeDisable}"
					class="g-m-r-5"
					type="month"
					format="yyyy-MM"
					placeholder="开始时间"
					style="width: 220px"
					@on-change="handleStartTime"
				/>
				<i-date-picker
					v-model="keywords.end_time"
					:options="{disabledDate:endTimeDisable}"
					class="g-m-r-5"
					type="month"
					format="yyyy-MM"
					placeholder="结束时间"
					style="width: 220px"
					@on-change="handleEndTime"
				/>
				<i-button
					type="primary"
					class="g-m-r-5"
					@click="handleSearch"
				>
					搜索
				</i-button>
			</div>
		</div>
		<oa-loading v-if="loading"/>
		<div v-else>
			<div class="g-m-lr-20 g-m-b-10 _content-box">
				<div 
					:class="{'g-m-b-20':JSON.stringify(qualityOption) != '{}'}" 
					class="g-fs-14 g-pd-l-10 _content-title"
				>
					质检数量统计
				</div>
				<div 
					v-if="JSON.stringify(qualityOption) != '{}'" 
					class="_content"
				>
					<vc-echarts
						:options="qualityOption"
						:auto-resize="true"
					/>
				</div>
				<div
					v-else
					class="_empty g-flex g-jc-c g-ai-c"
				>
					<div>
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">暂无数据，赶快添加一条吧~ </div>
					</div>
				</div>
			</div>
			<div class="g-m-lr-20 g-m-b-10 _content-box">
				<div
					:class="{'g-m-b-20':JSON.stringify(scoreOption) != '{}'}" 
					class="g-fs-14 g-pd-l-10 _content-title"
				>
					客户评分统计
				</div>
				<div
					v-if="JSON.stringify(scoreOption) != '{}'"
					class="_content"
				>
					<vc-echarts 
						:options="scoreOption"
						:auto-resize="true"
					/>
				</div>
				<div
					v-else
					class="_empty g-flex g-jc-c g-ai-c"
				>
					<div>
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">暂无数据，赶快添加一条吧~ </div>
					</div>
				</div>
			</div>
			<div class="g-m-lr-20 g-m-b-10 _content-box">
				<div
					:class="{'g-m-b-20':JSON.stringify(ratioList) != '[]'}" 
					class="g-fs-14 g-pd-l-10 _content-title"
				>
					质检比率统计
				</div>
				<div 
					v-if="JSON.stringify(ratioList) != '[]'
					|| JSON.stringify(ratioOption) != '{}'"
				>
					<div style="margin-left:60px;">
						<i-circle
							v-for="(item, index) in ratioList"
							:key="index"
							:size="120"
							:trail-width="10"
							:stroke-width="10"
							:percent="item.value"
							:stroke-color="item.label"
							stroke-linecap="square"
							style="margin-right:50px;"
						>
							<div class="demo-Circle-custom">
								<div 
									class="g-fs-12 g-pd-lr-20 g-pd-b-5"
									style="width:100%;"
								>
									{{ item.name }}
								</div>
								<span>
									<i>{{ item.value }}%</i>
								</span>
							</div>
						</i-circle>
					</div>
					<div class="_content">
						<vc-echarts 
							:options="ratioOption"
							:auto-resize="true"
						/>
					</div>
				</div>
				<div
					v-else
					class="_empty g-flex g-jc-c g-ai-c"
				>
					<div>
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">暂无数据，赶快添加一条吧~ </div>
					</div>
				</div>
			</div>
			<div class="g-m-lr-20 g-m-b-10 _content-box">
				<div
					:class="{'g-m-b-20':JSON.stringify(clientOption) != '{}'}" 
					class="g-fs-14 g-pd-l-10 _content-title"
				>
					质检客户情况
				</div>
				<div
					v-if="JSON.stringify(clientOption) != '{}'"
					class="_content"
				>
					<vc-echarts 
						:options="clientOption"
						:auto-resize="true"
					/>
				</div>
				<div
					v-else
					class="_empty g-flex g-jc-c g-ai-c"
				>
					<div>
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">暂无数据，赶快添加一条吧~ </div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Cascader, Circle } from 'iview';
import { Echarts } from 'wya-vc';
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { getHashUrl } from '@utils/utils';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Loading from '@components/_common/loading/loading';
import { services } from '@stores/services/sale';
import { debounce } from 'lodash';

export default {
	name: 'oa-quality-data',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'vc-echarts': Echarts,
		'i-circle': Circle,
		'oa-loading': Loading,
	},
	mixins: [services.departAll()],
	data() {
		const { query = {} } = this.$route;

		return {
			loading: false,
			ratioList: [],
			qualityOption: {},
			scoreOption: {},
			ratioOption: {},
			clientOption: {},
			OSS_SEARCH_EMPTY,
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'line' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				type: 'scroll',
				orient: 'vertical',
				right: 0,
				top: 50,
				bottom: 20,
				icon: 'circle'
			},
			grid: {
				top: "50px",
				left: "60px",
				right: "200px",
				bottom: "50px",
				containLabel: true
			},
			xAxis: {
				type: 'category'
			},
			yAxis: {
				type: 'value',
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
			},
			keywords: {
				search: '', // 员工姓名/手机号
				depart_id: '', // 组织部门
				start_time: '', // 开始时间
				end_time: '', // 结束时间
				...query,
				depart_ids: (query.depart_ids ? query.depart_ids.split(',').map(item => +item) : []),
			},
			lineColor: ["#2397f9", "#F1E773", "#4fc43d", "#e84854", "#eb8f4a", "#BE71FF"],
			barColor: ["#2397f9", "#F1E773", "#4fc43d", "#e84854", "#eb8f4a"]
		};
	},
	watch: {
		'keywords.depart_ids': function (val) {
			this.keywords.depart_id = val[val.length - 1];
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 监听加入时间（开始）的on-change事件
		 */
		handleStartTime(val) {
			this.keywords.start_time = val;
			this.handleSearch();
		},
		/**
		 * 监听加入时间（结束）的on-change事件
		 */
		handleEndTime(val) {
			this.keywords.end_time = val;
			this.handleSearch();
		},
		startTimeDisable(date) {
			if (!this.keywords['end_time']) {
				return false;
			}
			return !(moment(date).isAfter(moment(this.keywords['end_time']).subtract(1, 'years'))
			&& moment(date).isBefore(moment(this.keywords['end_time'])));
		},
		endTimeDisable(date) {
			if (!this.keywords['start_time']) {
				return false;
			}
			return !(moment(date).isBefore(moment(this.keywords['start_time']).add(1, 'years'))
			&& moment(date).isAfter(moment(this.keywords['start_time'])));
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			let params = {
				...this.keywords,
				depart_ids: this.keywords.depart_ids.length ? this.keywords.depart_ids : undefined
			};

			this.$router.replace(getHashUrl(
				'/statistics/quality/data',
				params
			));
			this.loadData(params);
		}),
		/**
		 * 数据加载
		 */
		loadData(param = {}) {
			this.loading = true;
			this.ratioList = [];
			this.qualityOption = {};
			this.scoreOption = {};
			this.ratioOption = {};
			this.clientOption = {};
			
			this.$request({
				url: API_ROOT.STATISTICS_QUALITY_DATA_GET,
				type: 'GET',
				loading: false,
				param,
				autoTip: false
			}).then(({ data }) => {
				this.loading = false;
				this.ratioList = data.ratioList;
				this.handleOption(data);
			}).catch(error => {
				this.loading = false;
			});
		},
		/**
		 * 数据处理
		 */
		handleOption({ qualityData, scoreData, ratioData, clientData }) {
			let qualitySeries = [];
			let scoreSeries = [];
			let ratioSeries = [];
			let clientSeries = [];

			let qualityCount = qualityData.count;
			let scoreCount = scoreData.count;
			let scorePercent = scoreData.percent;
			let ratioCount = ratioData.count;
			let ratioPercent = ratioData.percent;
			let clientCount = clientData.count;

			qualityData['data'].forEach((item, index) => {
				qualitySeries.push({
					name: item.name,
					type: 'line',
					data: item.value
				});
			});

			scoreData['data'].forEach((item, index) => {
				scoreSeries.push({
					name: item.name,
					type: 'line',
					count: item.value,
					data: item.count
				});
			});

			ratioData['data'].forEach((item, index) => {
				ratioSeries.push({
					name: item.name,
					type: 'line',
					count: item.count,
					data: item.value
				});
				
			});

			clientData['data'].forEach((item, index) => {
				clientSeries.push({
					name: item.name,
					type: 'bar',
					stack: item.name,
					data: item.value
				});
			});

			this.qualityOption = {
				color: this.lineColor,
				title: {
					text: ''
				},
				tooltip: {
					...this.tooltip,
					formatter(params) {  
						let relVal = params[0].name; 
					
						for (let i = 0, l = params.length; i < l; i++) {  
							relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + "人";  
						}  
						return relVal;  
					}
				},
				legend: {
					...this.legend,
					formatter: (name) => {
						let str = name.split(",");
						return str.join(' ');
					}
				},
				grid: this.grid,
				xAxis: {
					...this.xAxis,
					data: qualityData.month
				},
				yAxis: {
					...this.yAxis,
					axisLabel: {
						formatter(val) {
							return val + '人';
						}
					}
				},
				series: qualitySeries
			};

			this.scoreOption = {
				color: this.lineColor,
				title: {
					text: ''
				},
				tooltip: {
					...this.tooltip,
					formatter(params) {  
						let relVal = params[0].name; 
						let data = scoreSeries;

						for (let i = 0, l = params.length; i < l; i++) { 
							let index = params[i].dataIndex;
							relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : '
								+ data[i].data[index] + "人（" + data[i].count[index] + '%）';  
						}  
						return relVal;  
					}
				},
				legend: {
					...this.legend,
					formatter: (name) => {
						let str = name.split(",");
						return str.join(' ');
					}
				},
				grid: this.grid,
				xAxis: {
					...this.xAxis,
					data: scoreData.month
				},
				yAxis: {
					...this.yAxis,
					axisLabel: {
						formatter(val) {
							return val + '人';
						}
					}
				},
				series: scoreSeries
			};

			this.ratioOption = {
				color: this.lineColor,
				tooltip: {
					...this.tooltip,
					formatter(params) {  
						let relVal = params[0].name; 
						let data = ratioSeries;

						for (let i = 0, l = params.length; i < l; i++) { 
							let index = params[i].dataIndex;
							relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : '
								+ data[i].data[index] + "%（" + data[i].count[index] + '个）';  
						}  
						return relVal;  
					}
				},
				legend: {
					...this.legend,
					formatter: (name) => {
						let str = name.split(",");
						return str.join(' ');
					}
				},
				grid: this.grid,
				xAxis: {
					...this.xAxis,
					data: ratioData.month
				},
				yAxis: {
					...this.yAxis,
					axisLabel: {
						formatter(val) {
							return val + '%';
						}
					}
				},
				series: ratioSeries,
			};

			this.clientOption = {
				color: this.barColor,
				title: {
					text: ''
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
						shadowStyle: {
							color: 'rgba(150,150,150,0.1)'
						}
					},
					formatter(params) {  
						let relVal = params[0].name; 
					
						for (let i = 0, l = params.length; i < l; i++) {  
							relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + "个";  
						}  
						return relVal;  
					}
				},
				legend: {
					...this.legend,
					formatter: (name) => {
						let str = name.split(",");
						return str.join(' ');
					}
				},
				grid: this.grid,
				xAxis: {
					...this.xAxis,
					data: clientData.month
				},
				yAxis: {
					...this.yAxis,
					axisLabel: {
						formatter(val) {
							return val + '个';
						}
					}
				},
				series: clientSeries
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.v-statistics-quality-data {
	._head {
		.__btn {
			border-color: #e84854;
			color: #e84854;
			&:hover {
				background-color: #e84854!important;
				color: #fff!important;
			}
		}
	}
	._tip {
		font-weight: 600;
	}
	._content-box {
		border-radius: 4px;
		border: 1px solid #ebeef1;
		&:hover {
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		}
	}
	._content-title {
		color:#333;
		font-weight:bold;
		background-color: #f8f8f8;
		line-height: 45px;
	}
	._content {
		height: 500px;
		width: 90%;
	}
	._empty {
		height: 500px;
		width: 100%;
	}
}
</style>
