<template>
	<div class="g-flex g-jc-sb g-ai-c g-lh-42">
		<div class="g-fw-w g-lh-42">
			<i-select
				v-model="baseType"
				class="g-m-r-5"
				style="width: 220px"
				clearable
				transfer
				@on-change="handleBaseType"
			>
				<i-option
					v-for="(item, index) in echartsList"
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>
			</i-select>
			<i-select
				v-model="obj.is_all"
				class="g-m-r-5"
				style="width: 220px"
				clearable
				transfer
				placeholder="全部数据"
				@on-change="handleSearch">
				<i-option v-for="(item, index) in dataList" :key="index" :value="item.value">{{ item.label }}</i-option>
			</i-select>
			<i-select
				ref="staff"
				v-model="obj.staff_id"
				:remote-method="loadStaff"
				:loading="staffLoading"
				class="g-m-r-5"
				style="width: 220px;"
				filterable
				remote
				clearable
				transfer
				label-in-value
				placeholder="请输入招聘人员姓名"
				@on-change="handleChange({staff_id: arguments[0]})"
				@on-query-change="handleQueryChange"
			>
				<i-option
					v-for="(item, index) in staffData"
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>
			</i-select>
			<i-date-picker
				v-if="baseType==0||baseType==1||baseType==2"
				v-model="obj.interview_time_month"
				type="month"
				clearable
				transfer
				placeholder="请选择实际面试日期"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'interview_time_month')"
			/>
			<i-date-picker
				v-if="baseType==3"
				v-model="obj.try_start_time_month"
				type="month"
				clearable
				transfer
				placeholder="请选择试岗日期"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'try_start_time_month')"
			/>
			<i-date-picker
				v-if="baseType==4"
				v-model="obj.entry_time_month"
				type="month"
				clearable
				transfer
				placeholder="请选择入职日期"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'entry_time_month')"
			/>
			<i-cascader
				v-model="obj.position_id"
				:data="recruitDePosition"
				class="g-m-r-5"
				style="width: 220px; display: inline-block"
				clearable
				transfer
				filterable
				trigger="click"
				placeholder="请选择应聘职位"
				@on-change="handleSearch"
			/>
			<i-button type="primary" @click="handleSearch">
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import moment from "moment";
import { services, createSearch } from '@stores/services/hr';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { Input, Button, Cascader, Select, Option, DatePicker } from 'iview';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
	},
	mixins: [
		services.recruitDePosition(),
		createSearch({ key: 'staff' })
	],
	data() {
		const { query = {} } = this.$route;
		return {
			baseType: Number(query.baseType) || 0,
			staff: query.staff_name || '',
			noSearching: false,
			staffLoading: false,
			echartsList: [
				{ label: "实际面试人数", value: 0 },
				{ label: "面试通过人数", value: 1 },
				{ label: "面试淘汰人数", value: 2 },
				{ label: "试岗人数", value: 3 },
				{ label: "入职人数", value: 4 }
			],
			dataList: [
				{ label: "全部数据", value: "1" },
				{ label: "我的数据", value: "0" }
			],
			obj: {
				...query,
				is_all: query.is_all,
				staff_id: Number(query.staff_id),
				position_id: query.position_id ? query.position_id.split(',').map((item) => Number(item)) : [],
				interview_time_month: query.interview_time_month || '',
				try_start_time_month: query.try_start_time_month || '',
				entry_time_month: query.entry_time_month || '',
			},
		};
	},
	mounted() {
		const { query = {} } = this.$route;
		query.is_all ? this.obj.is_all = query.is_all : '1';
		if (query.staff_name) {
			this.obj.staff_id = Number(query.staff_id);
			// query.staff_name ? this.loadInitData(query.staff_name, 'staff') : null;
		}
	},
	methods: {
		handleBaseType(value) {
			this.baseType = value;
			this.handleSearch();
		},

		handleQueryChange(query = '') {
			let targetQuery = this.obj.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 日期改变
		handleDateChange(val, name) {
			this.obj[`${name}`] = val;
			this.handleSearch();
		},
		// 员工变化
		handleChange(obj) {
			this.obj.staff_id = value ? value.value : '';
			this.obj.staff_name = value ? value.label : '';
			this.handleSearch();
		},
		// 搜索方法
		handleSearch: lodash.debounce(function (event) {
			const { query = {} } = this.$route;
			const _query = 	{
				...this.obj,
				type: query.type,
				baseType: this.baseType,
				interview_time_month: '',
				try_start_time_month: '',
				entry_time_month: '',
				position_id: this.obj.position_id.length ? this.obj.position_id : null,
			};
			this.formatQuery(_query);

			this.$router.replace(getHashUrl(
				'/hr/recruit/social/statistics',
				_query
			));
		}, 300),
		formatQuery(query) {
			if (query.baseType <= 2) {
				this.obj.interview_time_month && (query.interview_time_month = moment(this.obj.interview_time_month).format('YYYY-MM'));
			} else if (query.baseType == 3) {
				this.obj.try_start_time_month && (query.try_start_time_month = moment(this.obj.try_start_time_month).format('YYYY-MM'));
			} else if (query.baseType == 4) {
				this.obj.entry_time_month && (query.entry_time_month = moment(this.obj.entry_time_month).format('YYYY-MM'));
			}

		}
		// 导出数据
		// handleOutput: lodash.debounce(function () {
		// 	const { query = {} } = this.$route;
		// 	let url = getHashUrl(API_ROOT['HR_RECRUIT_SOCIAL_FOLLOW_LIST_GET'], { // eslint-disable-line
		// 		...query,
		// 		is_export: 1,
		// 		'-token': this.$global.token
		// 	});
		// 	window.open(url);
		// }, 300),
	}
};
</script>



