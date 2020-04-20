<template>
	<div class="v-hr-em-data-emdata">
		<!-- <oa-loading v-if="close"/> -->
		<div class="g-flex g-jc-sb">
			<div class="g-flex">
				<i-date-picker
					v-model="searchDate"
					:options="dateOption"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择查询的时间段"
					style="width: 220px;"
					class="g-m-r-10"
					@on-change="handleDateChange"/>

				<i-cascader
					:data="departAll"
					v-model="depart_id"
					:change-on-select="true"
					clearable
					transfer
					placeholder="请选择部门"
					trigger="click"
					style="width: 220px;"
					@on-change="handleDepartChange"/>

				<vc-debounce-click
					class="g-red-btn-small g-m-l-10"
					@click="loadData">
					搜索
				</vc-debounce-click>
			</div>
			<vc-debounce-click
				v-if="$auth[675]"
				class="g-red-btn-line"
				@click="handleOutput">
				数据导出
			</vc-debounce-click>
		</div>

		<div class="_on-job g-m-t-20">
			<div class="_title g-flex g-jc-sb g-bg-gray-mid">
				<span class="g-m-l-20">在职人员汇总</span>
				<span class="g-m-r-20 g-flex g-ai-c">
					<span class="_on-color g-m-r-5"/>在职人数
				</span>
			</div>
			<oa-echarts
				:data1="on_count"
				:label="label1"
				:charts_id="1"/>
		</div>

		<div class="_leave-job g-m-t-20">
			<div class="_title g-flex g-jc-sb g-bg-gray-mid">
				<span class="g-m-l-20">人员流动数据汇总</span>
				<span class="g-m-r-20 g-flex g-ai-c">
					<span class="_in-color g-m-r-5"/>入职人数
					<span class="g-m-l-20 _leave-color g-m-r-5"/>离职人数
					<!-- <span class="_first-color g-m-l-20 g-m-r-5"/>1部
					<span class="_second-color g-m-l-20 g-m-r-5"/>2部
					<span class="_third-color g-m-l-20 g-m-r-5"/>3部
					<span class="_fourth-color g-m-l-20"/>4部 -->
				</span>
			</div>
			<oa-echarts
				:data1="in_count"
				:data2="leave_count"
				:label="label2"
				:charts_id="2" />
		</div>

		<div class="_leave-reason g-m-t-20">
			<div class="_title g-bg-gray-mid">
				<span class="g-m-l-20">离职人员主因汇总</span>
			</div>
			<oa-echarts
				:data1="reason_count"
				:charts_id="3" />
		</div>

		<div class="g-flex g-m-t-20">
			<i-date-picker
				v-model="monthStart"
				type="month"
				clearable
				transfer
				placeholder="请选择开始月份"
				style="width: 220px;" />
			<i-date-picker
				v-model="monthEnd"
				type="month"
				clearable
				transfer
				placeholder="请选择结束月份"
				style="width: 220px;"
				class="g-m-l-10" />
			<vc-debounce-click
				class="g-red-btn-small g-m-l-10"
				@click="handleTrendSearch">
				搜索
			</vc-debounce-click>
		</div>

		<div class="_trend g-m-t-20">
			<div class="_title g-bg-gray-mid">
				<span class="g-m-l-20">离职人员趋势图</span>
			</div>
			<oa-echarts :data1="leave_trend" :label="label4" :charts_id="4" width="312px" />
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/hr';
import { DebounceClick } from "wya-vc";
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { Button, Cascader, Input, Select, Option, DatePicker } from "iview";
import echarts from './oa-charts.vue';

export default {
	name: "oa-tpl",
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
		'oa-echarts': echarts
	},
	mixins: [
		services.departAll()
	],
	data() {
		return {
			// close: true,
			searchDate: '',
			monthStart: '',
			monthEnd: '',
			depart_id: [],
			on_count: [],
			in_count: [],
			leave_count: [],
			reason_count: [],
			leave_trend: [],
			label1: [],
			label2: [],
			label4: [],
			dateOption: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
			}
		};
	},
	created() {
		// 初始化图表数据
		this.loadData();
		this.loadTrendData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT.HR_EMPLOYEE_DATA_EMDATA_GET,
				type: "GET",
				param: {
					depart_id: this.depart_id.length ? this.depart_id[this.depart_id.length - 1] : '',
					start_time: formatMoment(this.searchDate[0]),
					end_time: formatMoment(this.searchDate[1])
				},
				loading: false
			}).then(res => {
				this.on_count = res.data.staff_on.on_count;
				this.label1 = res.data.staff_on.label;

				this.in_count = res.data.staff_leave.in_count;
				this.leave_count = res.data.staff_leave.leave_count;
				this.label2 = res.data.staff_leave.label;

				// 离职原因
				this.reason_count = res.data.leave_reason;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.on_count = [];
				this.label1 = [];

				this.in_count = [];
				this.leave_count = [];
				this.label2 = [];

				// 离职原因
				this.reason_count = [];
			});

		},
		loadTrendData() {
			// 离职分析
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_LEAVE_DATA_GET,
				type: "GET",
				param: {
					start_time: this.monthStart ? moment(this.monthStart).format('YYYY-MM') : '',
					end_time: this.monthEnd ? moment(this.monthEnd).format('YYYY-MM') : ''
				},
				loading: false
			}).then(res => {
				this.leave_trend = res.data.num;
				this.label4 = res.data.label;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.leave_trend = [];
				this.label4 = [];
			});
		},
		handleDateChange(val) {
			this.searchDate = val;
			this.loadData();
		},
		handleDepartChange(val) {
			this.depart_id = val;
			this.loadData();
		},
		// 数据导出
		handleOutput() {
			const url = getHashUrl(API_ROOT['_HR_EMPLOYEE_DATA_EMDATA_OUTPUT_GET'], {
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
		// 时间段查询
		handleTrendSearch() {
			let start = moment(this.monthStart).format('YYYY-MM');
			let end = moment(this.monthEnd).format('YYYY-MM');
			if (start !== 'Invalid date' && end !== 'Invalid date') {
				if (this.compareTime(start, end)) {
					this.loadTrendData();
				}
			} else if (start === 'Invalid date') {
				this.$Message.error('请选择开始时间');
			} else if (end === 'Invalid date') {
				this.$Message.error('请选择结束时间');
			}
		},
		compareTime(start, end) {
			let time1 = start.split('-');
			let time2 = end.split('-');
			if (Number(time1[0]) < Number(time2[0])) {
				return true;
			} else if (Number(time1[0]) === Number(time2[0])) {
				if (Number(time1[1]) <= Number(time2[1])) {
					return true;
				} else {
					this.$Message.error('开始月份不能小于结束月份');
					return false;
				}
			} else {
				this.$Message.error('开始时间不能小于结束时间');
				return false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-em-data-emdata {
    ._on-job, ._leave-job, ._leave-reason, ._trend {
        height: 350px;
		box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		._title {
			height: 46px;
			line-height: 46px;
			._on-color {
				display: inline-block;
				width: 14px;
				height: 14px;
				background-color: #398eeb;
			}
		}
    }
    ._leave-job {
		._title {
			._in-color, ._leave-color {
				display: inline-block;
				width: 14px;
				height: 14px;
				background-color: #58b0fa;
			}
			._leave-color {
				background-color: #398eeb;
			}
			// ._first-color {
			// 	background-color: rgb(136, 206, 157);
			// }
			// ._second-color {
			// 	background-color: rgb(129, 188, 206);
			// }
			// ._third-color {
			// 	background-color: rgb(185, 216, 160);
			// }
			// ._fourth-color {
			// 	background-color: rgb(119, 166, 219);
			// }
		}
    }
    ._leave-reason {
		height: 300px;
    }
}
</style>
