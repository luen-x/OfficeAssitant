<template>
	<div class="g-flex g-jc-sb g-ai-c g-lh-42">
		<div class="g-fw-w g-lh-42">
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
				:value="obj.month"
				type="month"
				clearable
				transfer
				class="g-m-r-5"
				style="width: 220px;"
				placeholder="请选择月份"
				@on-change="handleDateChange($event, 'month')"
			/>
			<i-button type="primary" @click="handleSearch">
				搜索
			</i-button>
		</div>
		<div
			class="g-red-btn-line"
			style="margin-top: 2px;"
			@click="handleOutput">
			导出
		</div>

	</div>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { services, searchStaff } from '@stores/services/hr';
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
		services.departAll(),
		services.education(),
		services.ditches(),
		searchStaff
	],
	data() {
		const { query = {} } = this.$route;
		return {
			staffLoading: false,
			dataList: [
				{ label: '全部数据', value: '1' },
				{ label: '我的数据', value: '0' }
			],
			noSearching: false,
			inviteData: [],
			interviewerData: [],
			obj: {
				...query,
				is_all: query.is_all || '1',
				all_invite: query.all_invite || '0',
				search: query.search,
				interviewer_name: query.interviewer_name,
				education: Number(query.education),
				ditch: Number(query.ditch),
				staff_id: Number(query.staff_id),
				invite_id: Number(query.invite_id),
				position_id: query.position_id ? query.position_id.split(',').map((item) => Number(item)) : [],
				try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : [],
				time: query.create_time_start ? [query.create_time_start, query.create_time_end] : []
			},
		};
	},
	mounted() {
		const { query = {} } = this.$route;
		query.is_all ? this.obj.is_all = query.is_all : '1';
		query.all_invite ? this.obj.all_invite = query.all_invite : '0';

		if (query.staff_name) {
			this.obj.staff_id = Number(query.staff_id);
			query.staff_name ? this.loadInitData(query.staff_name, 'staff') : null;
		}
		query.invite_name ? this.loadInitData(query.invite_name, 'invite') : null;

	},
	methods: {
		// 初始化远程搜索框
		loadInitData(query, name) {
			this.$request({
				url: API_ROOT._HR_STAFF_GET,
				type: 'GET',
				param: {
					name: query
				},
				loading: false
			}).then(res => {
				name === 'invite' ? this.inviteData = res.data : this.interviewerData = res.data;
			}).catch(error => {});
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
					name === 'invite' ? this.inviteData = res.data : this.interviewerData = res.data;
				}).catch(error => {
					this.staffLoading = false;
				});
			} else {
				name === 'invite' ? this.inviteData = [] : this.interviewerData = [];
			}
		},

		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateRangeChange(val, name) {
			this.obj[`${name}_start`] = val[0];
			this.obj[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleDateChange(val, name) {
			this.obj[`${name}`] = val;
			this.handleSearch();
		},
		handleQueryChange(query = '') {
			let targetQuery = this.obj.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		// 员工变化
		handleChange(obj) {
			this.obj.staff_id = value ? value.value : '';
			this.obj.staff_name = value ? value.label : '';
			this.handleSearch();
		},
		// 搜索方法
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/social/statistics', {
					...this.obj,
					position_id: this.obj.position_id.length ? this.obj.position_id : null,
					try_depart_id: this.obj.try_depart_id.length ? this.obj.try_depart_id : null,
					time: this.obj.time.length ? this.obj.time : null
				}
			));

		}, 300),
		// 导出数据
		handleOutput: lodash.debounce(function () {
			const { query = {} } = this.$route;
			let url = '';
			url = getHashUrl(API_ROOT['HR_RECRUIT_INTERVIEWER_RECORD_GET'], { // eslint-disable-line
				...query,
				is_export: 1,
				'-token': this.$global.token
			});
			window.open(url);
		}, 300),

	}
};
</script>

<style lang="scss" scoped>

</style>




