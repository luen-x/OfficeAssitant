<template>
	<div class="g-flex g-jc-sb g-ai-c g-lh-42">
		<div class="g-fw-w g-lh-42">
			<i-select
				v-model="obj.is_all"
				class="g-m-r-5"
				style="width: 220px"
				clearable
				transfer
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item, index) in dataList"
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>
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
				v-model="obj.interview_time"
				type="daterange"
				clearable
				transfer
				placeholder="请选择实际面试日期"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'interview_time')"
			/>
			<i-date-picker
				v-if="baseType==3"
				v-model="obj.try_start_time"
				type="daterange"
				clearable
				transfer
				placeholder="请选择试岗日期"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'try_start_time')"
			/>
			<i-date-picker
				v-if="baseType==4"
				v-model="obj.entry_time"
				type="daterange"
				clearable
				transfer
				placeholder="请选择入职日期"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'entry_time')"
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
		createSearch({ key: 'staff' })
	],
	data() {
		const { query = {} } = this.$route;
		return {
			baseType: query.baseType || 0,
			staff: query.staff_name || '',
			noSearching: false,
			staffLoading: false,
			dataList: [
				{ label: "全部数据", value: "1" },
				{ label: "我的数据", value: "0" }
			],
			obj: {
				...query,
				is_all: Number(query.is_all),
				staff_id: Number(query.staff_id),
				interview_time: query.interview_time_start ? [query.interview_time_start, query.interview_time_end] : '',
				entry_time: query.entry_time_start ? [query.entry_time_start, query.entry_time_end] : '',
				try_start_time: query.try_start_time_start ? [query.try_start_time_start, query.try_start_time_end] : '',
			},
		};
	},
	mounted() {
		const { query = {} } = this.$route;
		query.is_all ? this.obj.is_all = query.is_all : '1';
	},
	methods: {
		// 日期改变
		handleDateChange(val, name) {
			// delete this.obj[`${name}`];
			this.obj[`${name}_start`] = val[0];
			this.obj[`${name}_end`] = val[1];
			this.handleSearch();
		},
		// 员工变化
		handleChange(obj) {
			let type = Object.keys(obj)[0];
			let value = obj[type];
			this.obj.staff_id = value ? value.value : '';
			this.obj.staff_name = value ? value.label : '';
			this.handleSearch();
		},
		handleQueryChange(query = '') {
			let targetQuery = this.obj.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		// 远程搜索方法
		loadStaffData(query, name) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._HR_STAFF_GET,
					type: 'GET',
					param: {
						// name: typeof query === 'string' ? query.trim().replace(/\(.*?\)/g, '').replace(/（.*?）/g, '') : query
						name: query.trim()
					},
					loading: false
				}).then(res => {
					this.staffLoading = false;
					this.interviewerData = res.data;
				}).catch(error => {
					this.staffLoading = false;
				});
			} else {
				name === 'invite' ? this.inviteData = [] : this.interviewerData = [];
			}
		},
		// 搜索方法
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/social/social-statistics-details',
				{
					
					...this.obj,
					type: this.type,
					baseType: this.baseType,
				}
			));
			this.$store.commit('HR_RECRUIT_SOCIAL_FOLLOW_LIST_INIT');
		}, 300),
		// 导出数据
		// handleOutput: lodash.debounce(function () {
		// 	const { query = {} } = this.$route;
		// 	let url = getHashUrl(API_ROOT['HR_RECRUIT_SOCIAL_FOLLOW_LIST_GET'], { // eslint-disable-line
		// 		...query,
		// 		is_export: 1,
		// 		'-token': getItem(`staff_${this.$global.version}`).token
		// 	});
		// 	window.open(url);
		// }, 300),
	}
};
</script>



