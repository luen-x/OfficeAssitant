<template>
	<div class="v-hr-social-transform">
		<oa-title title="转化漏斗"/>
		<div class="g-flex g-fd-c g-ai-c">
			<div class="_chart g-relative">
				<oa-loading v-if="show"/>
				<vc-echarts :options="option" :auto-resize="true" />
			</div>
		</div>
		<oa-title title="转化明细"/>
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight}"
			mode="table"
			class="g-m-t-20 v-hr-social-transform-list"
			@page-size-change="handleChangePageSize"
		/>
		<oa-title title="面试统计"/>
		<oa-echarts :data-label="dateX" :value="dataY" :detail="detail"/>
	</div>
</template>

<script>
import { Echarts, Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import { tableHeight } from '@extends/mixins/tableHeight';
import moment from 'moment';
import echarts from "./oa-charts.vue";
import Title from "../../../_common/title";


export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
		"vc-echarts": Echarts,
		"oa-echarts": echarts,
		"oa-title": Title
	},
	mixins: [
		tableHeight({})
	],
	props: {
		columns: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		const { query } = this.$route;

		return {
			option: {},
			label: [],
			value: [],
			percent: [],
			show: false,
			dataY: [],
			dateX: [],
			detail: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSocialStatistics.ssList;
		}
	},
	watch: {
		$route(to, from) {
			this.loadInterviewData();
		},
		label(newVal, oldVal) {
			this.option = {
				tooltip: {
					show: true
				},
				grid: {
					top: 23,
					left: "3%",
					right: "15%",
					bottom: 20,
					containLabel: true
				},
				xAxis: {
					type: "value",
					axisLabel: {
						formatter: "{value}人"
					}
				},
				yAxis: {
					type: "category",
					data: this.label
				},
				series: [
					{
						name: "转化率",
						type: "bar",
						barWidth: "30px",
						barGap: "-100%",
						color: "#fff",
						data: this.value,
						label: {
							normal: {
								show: true,
								color: "#388feb",
								position: "right",
								distance: 10,
								formatter: (params) => {
									switch (params.dataIndex) {
										case 0:
											return '';
										case 1:
											return '面试率  ' + this.percent[1];
										case 2:
											return '发offer率  ' + this.percent[2];
										case 3:
											return '试岗率  ' + this.percent[3];
										case 4:
											return '入职率  ' + this.percent[4];
										default:
											break;
									}
								}
							}
						}
					},
					{
						barWidth: "30px", // 柱子宽度
						barCategoryGap: "20px", // 柱间距离
						color: ["#388feb"],
						data: this.value,
						stack: 'sum',
						type: "bar",
						label: {
							normal: {
								show: true,
								position: "insideRight",
								distance: 20,
								formatter: (params) => {
									return params.data === 0 ? '' : params.data;
								}
							}
						}
					}
				]
			};
		}
	},
	mounted() {
		this.loadInterviewData();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			this.show = true;
			return this.request({
				url: 'HR_RECRUIT_SOCIAL_TRANSFORM_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					is_all: query.is_all ? query.is_all : '1'
				},
				loading: false
			}).then((res) => {
				this.show = false;
				this.label = res.data.label;
				this.value = res.data.value;
				this.percent = res.data.percent;
			}).catch((error) => {
				this.show = false;
				this.label = [];
				this.value = [];
				this.percent = [];
			});
		},
		loadInterviewData() {
			const { query = {} } = this.$route;
			this.dateX = [];
			this.dataY = [];
			this.$request({
				url: API_ROOT.HR_RECRUIT_SOCIAL_STATISTICS_LIST_GET,
				type: "GET",
				param: {
					...query,
				},
				loading: false
			}).then(res => {
				// 省份统计
				this.dataY = res.data.value;
				this.dateX = res.data.label;
				this.count = res.data.count;
				this.detail = res.data.detail;
				this.$forceUpdate();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SOCIAL_TRANSFORM_LIST_INIT');
		}
	}
};

</script>

<style lang="scss" scoped>
.v-hr-social-transform {
	._chart {
		width: 80%;
		height: 300px;
	}
}
</style>

