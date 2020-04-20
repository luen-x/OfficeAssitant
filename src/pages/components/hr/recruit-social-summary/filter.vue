<template>
	<div class="js-filter hr-recruit-social-summary-filter">
		<div class="g-flex-ac g-jc-sb">
			<div class="g-flex-ac g-col">
				<i-input
					v-model="keywords.search"
					clearable
					placeholder="请输入姓名或手机号"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button
					type="primary"
					class="g-m-l-10"
					@click="handleSearch"
				>
					搜索
				</i-button>
				<span
					v-if="searchData.title_show && searchData.title_show.length > 1"
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
			<router-link v-if="$auth[171]" class="g-red-btn-line g-m-r-10" to="/hr/recruit/social/summary/add">
				录入信息
			</router-link>
			<i-dropdown trigger="hover" @on-click="handleClickMore">
				<div class="_more g-flex g-jc-sb">
					更多功能
					<i class="iconfont icon-triangle-down g-fs-14 g-pointer" />
				</div>
				<i-dropdown-menu slot="list">
					<i-dropdown-item
						v-if="this.$auth[1032] && type !== '6' && type !== '7'"
						name="edit">
						批量编辑
					</i-dropdown-item>
					<i-dropdown-item name="identify">
						识别简历
					</i-dropdown-item>
					<i-dropdown-item name="selectTitle">
						选择表头
					</i-dropdown-item>
					<i-dropdown-item name="selectList">
						<span>列表设置</span>
					</i-dropdown-item>
					<i-dropdown-item v-if="$auth[172]" name="selectExport">
						<span>导出</span>
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid g-flex g-fw-w g-flex-ac"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<div>
					<i-select
						v-if="$auth[173] && showId.includes(2)"
						v-model="keywords.all_invite"
						class="g-m-r-5"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择邀约类型"
						@on-change="handleSearch({all_invite: arguments[0]})"
					>
						<i-option
							v-for="item in inviteType"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-select
						v-if="$auth[173]&& showId.includes(3)"
						ref="staff"
						:value="keywords.staff_id"
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
						@on-change="handleChange({staff_id: arguments[0]})"
						@on-query-change="handleQueryChange"
					>
						<i-option
							v-for="item in staffData"
							:key="item.value"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
					<i-cascader
						v-if="showId.includes(4)"
						v-model="keywords.position_id"
						:data="recruitDePosition"
						class="g-m-r-5"
						style="width: 220px; display: inline-block"
						clearable
						transfer
						filterable
						trigger="hover"
						placeholder="请输入职位查询"
						@on-change="handleSearch({position_id: arguments[0]})"
					/>
					<i-select
						v-if="showId.includes(5)"
						v-model="keywords.education"
						class="g-m-r-5"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择学历"
						@on-change="handleSearch({education: arguments[0]})"
					>
						<i-option
							v-for="item in education"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-select
						v-if="showId.includes(6)"
						v-model="keywords.ditch"
						class="g-m-r-5"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择招聘渠道"
						@on-change="handleSearch({ditch: arguments[0]})"
					>
						<i-option
							v-for="item in ditches"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-cascader
						v-if="showId.includes(7)"
						v-model="keywords.try_depart_id"
						:data="departAll"
						class="g-m-r-5"
						style="width: 220px; display: inline-block"
						clearable
						transfer
						trigger="hover"
						placeholder="请选择试岗部门"
						@on-change="handleSearch({try_depart_id: arguments[0]})"
					/>
					<i-select
						v-if="showId.includes(8)"
						v-model="keywords.is_remarks"
						class="g-m-r-5"
						style="width: 220px"
						clearable
						transfer
						placeholder="是否已加备注"
						@on-change="handleSearch({is_remarks: arguments[0]})"
					>
						<i-option
							v-for="item in singleData"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<!-- <i-date-picker
						:value="keywords.create_time"
						type="date"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择录入时间"
						@on-change="handleChange({create_time: arguments[0]})"
					/> -->
					<i-date-picker
						v-if="showId.includes(9)"
						:value="keywords.predict_interview_time"
						:split-panels="true"
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择预计面试日期"
						@on-change="handleChange({predict_interview_time: arguments[0]})"
					/>
					<i-date-picker
						v-if="showId.includes(10)"
						:value="keywords.interview_time"
						:split-panels="true"
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择实际面试日期"
						@on-change="handleChange({interview_time: arguments[0]})"
					/>
					<i-date-picker
						v-if="showId.includes(11)"
						:value="keywords.try_start_time"
						:split-panels="true"
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择试岗日期"
						@on-change="handleChange({try_start_time: arguments[0]})"
					/>
					<i-date-picker
						v-if="showId.includes(12)"
						:value="keywords.predict_entry_time"
						:split-panels="true"
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择预计入职日期"
						@on-change="handleChange({predict_entry_time: arguments[0]})"
					/>
					<i-date-picker
						v-if="showId.includes(13)"
						:value="keywords.entry_time"
						:split-panels="true"
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择入职日期"
						@on-change="handleChange({entry_time: arguments[0]})"
					/>
					<i-date-picker
						v-if="showId.includes(14)"
						:value="keywords.leave_time"
						:split-panels="true"
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择离职日期"
						@on-change="handleChange({leave_time: arguments[0]})"
					/>
				</div>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, Select, Option, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { ListSettingModal } from "@components/_common/list-set/list-setting";
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { services, createSearch, inviteType } from '@stores/services/hr';
import { singleData } from '@stores/services/common';
import lodash from 'lodash';
import { TableTitle } from '../../_common/table-title/table-title';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		'vc-expand': Expand
	},
	mixins: [
		services.departAll(),
		services.recruitDePosition(),
		services.education(),
		services.ditches(),
		createSearch({ key: 'staff' }),
		inviteType,
		singleData
	],
	data() {
		const { query = {} } = this.$route;
		return {
			searchData: this.$store.state.hrRecruitSocialSummary.searchData || [],
			staff: query.staff_name || '',
			keywords: {
				...query,
				all_invite: ['0', '1'].indexOf(query.all_invite) > -1 ? Number(query.all_invite) : (this.$auth[173] ? 1 : ''),
				education: Number(query.education),
				ditch: Number(query.ditch),
				staff_id: Number(query.staff_id),
				staff_name: query.staff_name,
				is_remarks: Number(query.is_remarks),
				position_id: query.position_id ? query.position_id.split(',').map((item) => Number(item)) : [],
				try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : [],
				entry_time: [query.entry_time_start, query.entry_time_end],
				try_start_time: [query.try_start_time_start, query.try_start_time_end],
				interview_time: [query.interview_time_start, query.interview_time_end],
				predict_interview_time: [query.predict_interview_time_start, query.predict_interview_time_end],
				predict_entry_time: [query.predict_entry_time_start, query.predict_entry_time_end],
				leave_time: [query.leave_time_start, query.leave_time_end],
			},
			show: false,
		};
	},

	computed: {
		type() {
			return this.$route.query.type ? this.$route.query.type : '0';
		},
		showId() {
			return this.searchData.title_show.map(item => +item.search_id);
		}

	},
	created() {
		this.searchData = this.$store.state.hrRecruitSocialSummary.searchData;
		this.searchLoadData();
	},
	methods: {
		handleQueryChange(query = '') {
			let targetQuery = this.keywords.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		handleSearch: lodash.debounce(function (value) {
			let params = {
				...this.$route.query,
				...this.keywords,
				fixPosition: true
			};
			if (value) {
				params = {
					...params,
					...value,
					position_id: this.keywords.position_id.length ? this.keywords.position_id : null,
					try_depart_id: this.keywords.try_depart_id.length ? this.keywords.try_depart_id : null,
				};
			}
			this.$router.replace(getHashUrl(
				'/hr/recruit/social/summary',
				params
			));
			this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(obj) {
			let type = Object.keys(obj)[0];
			let value = obj[type];
			if (type === 'staff_id') {
				this.keywords.staff_id = value ? value.value : '';
				this.keywords.staff_name = value ? value.label : '';
			} else {
				this.keywords[`${type}_start`] = value[0];
				this.keywords[`${type}_end`] = value[1];
			}
			this.handleSearch();
		},
		handleExport() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_RECRUIT_SOCIAL_SUMMARY_LIST_GET'], { // eslint-disable-line
				...query,
				is_export: 1,
				type: query.type ? query.type : '0',
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrRecruitSocialSummary.title[this.$route.query.type || '0'];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_RECRUIT_SOCIAL_SUMMARY_TITLE_CHANGE',
				type: this.$route.query.type || '0',
				scenario: 3
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit('hr-recruit-soical-title-change', { type: this.$route.query.type || '0' });
				this.$store.commit("HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT", {
					type: this.$route.query.type || '1'
				});
			}).catch(err => {
			});
		},
		handleClickMore(name) {
			const obj = {
				'edit': () => this.$router.push(getHashUrl(`/hr/recruit/social/summary/${name}`, { type: this.type })),
				'identify': () => this.$router.push(getHashUrl(`/hr/recruit/social/${name}`, {})),
				'selectTitle': this.handleSelectTitle,
				'selectList': this.handleSelectList,
				'selectExport': this.handleExport,
			};
			let fn = obj[name];
			fn();
		},	
		// 列表设置
		handleSelectList() {
			const sortData = this.$store.state.hrRecruitSocialSummary.sortData;
			const searchData = this.$store.state.hrRecruitSocialSummary.searchData;
			ListSettingModal.popup({
				scenario: 1,
				// sort_mutation: "HR_RECRUIT_SOCIAL_SUMMARY_LIST_SORT",
				// sortData,
				searchData,
				search_mutation: "HR_RECRUIT_SOCIAL_SUMMARY_LIST_SEARCH",
				// sortUrl: "_HR_RECRUIT_SCHOOL_SAVE_LABEL_SETTINGS_POST",
				searchUrl: "_HR_RECRUIT_SCHOOL_SAVE_LABEL_SETTINGS_POST"
			}).then(res => {
				res && this.$store.commit("HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT", { type: "" });
			});
		},
		searchLoadData() {
			return this.$request({
				url: "_HR_RECRUIT_SCHOOL_EDIT_CUSTOMER_LABEL_SETTING_GET",
				type: "GET",
				param: {
					scenario: 1,
					label: "search"
				},
				loading: false
			}).then(res => {
				this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_SEARCH', res.data);
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
	}
};

</script>

<style lang="scss" >
.hr-recruit-social-summary-filter {
	._more {
		width: 100px;
		color:#f14b5f;
		padding-left: 15px;
		padding-right: 15px;
		line-height: 30px;
		border: 1px solid #f14b5f;
		border-radius: 4px;
	}
}
</style>
