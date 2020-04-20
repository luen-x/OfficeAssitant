<template>
	<div class="js-filter">
		<div class="g-flex g-jc-sb g-ai-c g-lh-42">
			<div class="g-fw-w g-lh-42">
				<i-input
					v-model="query.search"
					clearable
					placeholder="请输入姓名或手机号"
					class="g-m-r-5"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button
					type="primary"
					@click="handleSearch"
				>
					搜索
				</i-button>
				<span
					class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
					@click="handleToggle"
				>
					更多搜索条件
					<i
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span>
			</div>
			<div
				class="g-red-btn-line"
				style="margin-top: 2px;"
				@click="handleOutput">
				导出
			</div>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>

				<i-select
					v-model="query.all_invite"
					class="g-m-r-5"
					style="width: 220px"
					clearable
					transfer
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in inviteList"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					ref="staff"
					v-model="query.staff_id"
					:remote-method="loadStaff"
					:loading="staffLoading"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请选择邀约人"
					@on-change="handleChange"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-cascader
					v-model="query.position_id"
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
				<i-select
					v-model="query.education"
					class="g-m-r-5"
					style="width: 220px"
					clearable
					transfer
					placeholder="请选择学历"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in education"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<i-select
					v-model="query.ditch"
					class="g-m-r-5"
					style="width: 220px"
					clearable
					transfer
					placeholder="请选择招聘渠道"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in ditches"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<i-cascader
					v-model="query.try_depart_id"
					:data="departAll"
					class="g-m-r-5"
					style="width: 220px; display: inline-block"
					clearable
					transfer
					change-on-select
					trigger="click"
					placeholder="请选择试岗部门"
					@on-change="handleSearch"
				/>
				<i-date-picker
					:value="query.create_time"
					:split-panels="true"
					clearable
					transfer
					type="daterange"
					class="g-m-r-5"
					style="width: 220px;"
					placeholder="请选择录入时间"
					@on-change="handleDateChange($event, 'create_time')"
				/>
				<i-date-picker
					:value="query.try_start_time"
					:split-panels="true"
					clearable
					transfer
					type="daterange"
					class="g-m-r-5"
					style="width: 220px;"
					placeholder="请选择试岗时间"
					@on-change="handleDateChange($event, 'try_start_time')"
				/>
				<i-date-picker
					:value="query.interview_time"
					:split-panels="true"
					clearable
					transfer
					type="daterange"
					class="g-m-r-5"
					style="width: 220px;"
					placeholder="请选择实际面试日期"
					@on-change="handleDateChange($event, 'interview_time')"
				/>
				<i-date-picker
					:value="query.entry_time"
					:split-panels="true"
					clearable
					transfer
					type="daterange"
					class="g-m-r-5"
					style="width: 220px;"
					placeholder="请选择入职日期"
					@on-change="handleDateChange($event, 'entry_time')"
				/>
				<i-date-picker
					:value="query.leave_time"
					:split-panels="true"
					clearable
					transfer
					type="daterange"
					class="g-m-r-5"
					style="width: 220px;"
					placeholder="请选择离职日期"
					@on-change="handleDateChange($event, 'leave_time')"
				/>
				<i-select
					v-model="query.status"
					class="g-m-r-5"
					style="width: 220px"
					clearable
					transfer
					placeholder="请选择招聘状态"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in recruitStatus"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<i-select
					v-model="query.pass_type"
					class="g-m-r-5"
					style="width: 220px"
					clearable
					transfer
					placeholder="请选择淘汰状态"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in passStatus"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Expand } from 'wya-vc';
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
		'vc-expand': Expand
	},
	mixins: [
		services.departAll(),
		services.recruitDePosition(),
		services.education(),
		services.ditches(),
		createSearch({ key: 'staff' })
	],
	props: {
		type: {
			type: String,
			default: ""
		},
	},
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				...query,
				all_invite: query.all_invite || '1',
				education: Number(query.education),
				ditch: Number(query.ditch),
				staff_id: Number(query.staff_id),
				staff_name: query.staff_name,
				position_id: query.position_id ? query.position_id.split(',').map((item) => Number(item)) : [],
				try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : [],
				create_time: query.create_time_start ? [query.create_time_start, query.create_time_end] : '',
				try_start_time: query.try_start_time_start ? [query.try_start_time_start, query.try_start_time_end] : '',
				interview_time: query.interview_time_start ? [query.interview_time_start, query.interview_time_end] : '',
				entry_time: query.entry_time_start ? [query.entry_time_start, query.entry_time_end] : '',
				leave_time: query.leave_time_start ? [query.leave_time_start, query.leave_time_end] : '',
			},
			show: false,
			staffData: [],
			staff: query.staff_name || '',
			inviteList: [
				{ label: '全部邀约', value: '1' },
				{ label: '我的邀约', value: '0' }
			],
			recruitStatus: [
				{ label: '新候选人', value: '0' },
				{ label: '安排面试', value: '13' },
				{ label: '待发offer', value: '2' },
				{ label: '试岗', value: '3' },
				{ label: '待入职', value: '4' },
				{ label: '已入职', value: '5' },
				{ label: '已离职', value: '7' }
			],
			passStatus: [
				{ label: '未面试淘汰', value: '0' },
				{ label: '面试淘汰', value: '1' },
				{ label: '未接受offer', value: '2' },
				{ label: '试岗淘汰', value: '3' },
				{ label: '试岗完成淘汰', value: '4' }
			]
		};
	},
	methods: {
		handleQueryChange(query = '') {
			let targetQuery = this.query.staff_name || '';
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
		handleChange(staff) {
			this.query.staff_id = staff ? staff.value : '';
			this.query.staff_name = staff ? staff.label : '';
			this.handleSearch();
		},
		// 日期改变
		handleDateChange(val, name) {
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		// 搜索方法
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/social/statistics',
				{
					...this.query,
					type: this.type,
					position_id: this.query.position_id.length ? this.query.position_id : null,
					try_depart_id: this.query.try_depart_id.length ? this.query.try_depart_id : null
				}
			));

			this.$store.commit('HR_RECRUIT_SOCIAL_FOLLOW_LIST_INIT');
		}, 300),
		// 导出数据
		handleOutput: lodash.debounce(function () {
			const { query = {} } = this.$route;
			let url = getHashUrl(API_ROOT['HR_RECRUIT_SOCIAL_FOLLOW_LIST_GET'], { // eslint-disable-line
				...query,
				is_export: 1,
				'-token': this.$global.token
			});
			window.open(url);
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
	}
};
</script>

<style lang="scss" scoped>

</style>


