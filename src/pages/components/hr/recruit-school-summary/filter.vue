<template>
	<div class="js-filter hr-recruit-school-summary-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">

			<div>
				<i-input
					v-model="obj.search"
					placeholder="请输入姓名/手机号"
					clearable
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleInputChange" />

				<i-button
					type="primary"
					class="g-m-l-5"
					@click="handleSearch">
					搜索
				</i-button>

				<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
					更多搜索条件
					<i
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
						class="iconfont g-fs-12 g-c-black-dark" />
				</span>
			</div>

			<div>
				<vc-debounce-click
					v-if="$auth[140]"
					class="g-red-btn-line g-m-r-5"
					@click="handleInput">
					录入信息
				</vc-debounce-click>
				<i-dropdown
					trigger="hover"
					@on-click="handleClickMore">
					<div class="_more g-flex g-jc-sb">
						更多功能
						<i class="iconfont icon-triangle-down g-fs-14 g-pointer" />
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item
							v-if="$auth[1035] && ['0', '9', '10', '11', '12'].indexOf(type) === -1"
							name="edit">
							批量编辑
						</i-dropdown-item>
						<i-dropdown-item name="identify">简历识别</i-dropdown-item>
						<i-dropdown-item v-if="$auth[141]" name="export">导出</i-dropdown-item>
						<i-dropdown-item name="selectTitle">选择表头</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>

		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-input
					v-model="obj.college"
					placeholder="请输入学校名称"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange" />

				<i-select
					v-if="type == 2"
					v-model="obj.is_my_interview"
					transfer
					clearable
					placeholder="请选择面试条件"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option :value="1">我的面试</i-option>
					<i-option :value="0">查看全部</i-option>
				</i-select>

				<i-select
					v-model="obj.position_id"
					transfer
					clearable
					placeholder="请选择应聘岗位"
					style="width: 220px;"
					class="g-m-r-5"
					filterable
					@on-change="handleSearch">
					<i-option
						v-for="item in recruitAllPosition"
						:key="item.position_id"
						:value="item.position_id">
						{{ item.position_name }}
					</i-option>
				</i-select>

				<i-select
					v-model="obj.education"
					transfer
					clearable
					placeholder="请选择学历"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in education"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="obj.interview_result"
					transfer
					clearable
					placeholder="请选择面试结果"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in interResultList"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="obj.is_ticket"
					transfer
					clearable
					placeholder="有无车票信息"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in hasTicketlist"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>

				<i-cascader
					:data="departAll"
					v-model="obj.try_depart_id"
					:change-on-select="true"
					transfer
					clearable
					placeholder="请选择试岗部门"
					trigger="click"
					style="width: 220px;display: inline-block"
					class="g-m-r-5"
					@on-change="handleSearch" />

				<!-- <i-select
					v-model="obj.is_remarks"
					transfer
					clearable
					placeholder="是否已添加备注"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in isRemarkList"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select> -->
				<i-date-picker
					v-model="create_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择录入时间"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'create_time')"/>

				<i-date-picker
					v-model="send_offer_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择发offer日期"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'send_offer_time')"/>

				<i-date-picker
					v-model="register_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择实际报到日期"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'register_time')"/>

				<i-date-picker
					v-model="try_start_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择试岗日期"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'try_start_time')"/>

				<i-date-picker
					v-model="predict_entry_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择预计入职日期"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'predict_entry_time')"/>

				<i-date-picker
					v-model="pass_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择淘汰日期"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'pass_time')"/>

				<i-date-picker
					v-model="entry_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择入职日期"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'entry_time')"/>

				<i-date-picker
					v-model="reply_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择回复报到时间"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'reply_time')"/>

				<i-date-picker
					v-model="leave_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择离职日期"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'leave_time')"/>

				<i-date-picker
					v-model="communication_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择最新沟通日期"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'communication_time')"/>

				<i-select
					v-model="obj.meeting_year"
					transfer
					clearable
					placeholder="请选择招聘会年份"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in meetingYear"
						:key="item.value"
						:value="item.value + ''">
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="obj.season_type"
					transfer
					clearable
					placeholder="请选择招聘会季节"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in seasonType"
						:key="item.value"
						:value="item.value + ''">
						{{ item.label }}
					</i-option>
				</i-select>
				<i-select
					v-model="obj.is_leader"
					transfer
					clearable
					placeholder="请选择是否是干部"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in isLeaderList"
						:key="item.value"
						:value="item.value">
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
import { VcInstance } from "wya-vc/lib/vc/index";
import moment from 'moment';
import { getParseUrl, getHashUrl, formatMoment, getItem, initTreeData } from '@utils/utils';
import { Input, Button, Select, Option, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { services, interResultList, hasTicketlist, isRemarkList } from '@stores/services/hr';
import { TableTitle } from '../../_common/table-title/table-title';

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		'vc-expand': Expand,
	},
	mixins: [
		services.departAll(),
		services.recruitAllPosition(),
		services.education(),
		services.meetingYear(),
		services.seasonType(),
		interResultList,
		hasTicketlist,
		isRemarkList
	],
	data() {
		const { query = {} } = this.$route;
		const splitDay = moment().format('YYYY') + '-08-31';

		return {
			obj: {
				...query,
				position_id: Number(query.position_id),
				is_my_interview: Number(query.is_my_interview) || 0,
				education: Number(query.education),
				interview_result: Number(query.interview_result),
				is_ticket: Number(query.is_ticket),
				is_remarks: Number(query.is_remarks),
				meeting_year: query.meeting_year || moment().format('YYYY'),
				season_type: query.season_type || moment().isBefore(splitDay) ? '1' : '3',
				is_leader: Number(query.is_leader),
				try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : []
			},
			show: false,
			isLeaderList: [
				{
					label: '是',
					value: 1
				},
				{
					label: '否',
					value: 0
				}
			],
			reply_time: [query.reply_time_start, query.reply_time_end],
			leave_time: [query.leave_time_start, query.leave_time_end],
			pass_time: [query.pass_time_start, query.pass_time_end],
			entry_time: [query.entry_time_start, query.entry_time_end],
			create_time: [query.create_time_start, query.create_time_end],
			communication_time: [query.communication_time_start, query.communication_time_end],
			send_offer_time: [query.send_offer_time_start, query.send_offer_time_end],
			register_time: [query.register_time_start, query.register_time_end],
			try_start_time: [query.try_start_time_start, query.try_start_time_end],
			predict_entry_time: [query.predict_entry_time_start, query.predict_entry_time_end]
		};
	},
	computed: {
		type() {
			return this.$route.query.type ? this.$route.query.type : '0';
		}
	},
	watch: {
		type(val) {
			if (val == '2') {
				this.obj.is_my_interview = 0;
			} else {
				this.obj.is_my_interview = "";
			}
		}
	},
	created() {
		this.handleSeachInit();
	},
	methods: {
		handleSeachInit() {
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/summary',
				{
					...this.obj,
					fixPosition: true,
					type: this.type,
					try_depart_id: this.obj.try_depart_id.length ? this.obj.try_depart_id : null,
				}
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_LIST_INIT');
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/summary',
				{
					...this.obj,
					fixPosition: true,
					type: this.type,
					try_depart_id: this.obj.try_depart_id.length ? this.obj.try_depart_id : null,
				}
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateChange(val, name) {
			this.obj[`${name}_start`] = val[0];
			this.obj[`${name}_end`] = val[1];
			this.handleSearch();
		},
		// 录入
		handleInput() {
			this.$router.push('/hr/recruit/school/summary/add');
		},
		// 导出当前状态下的所有员工
		handleOutput() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_RECRUIT_SCHOOL_SUMMARY_LIST_GET'], {
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrRecruitSchoolSummary.title[this.$route.query.type || '0'];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_RECRUIT_SCHOOL_SUMMARY_TITLE_CHANGE',
				type: this.$route.query.type || '0',
				scenario: 2
			}).then(() => {
				this.$vc.emit('hr-recruit-school-title-change', { type: this.$route.query.type || '0' });
				this.$store.commit("HR_RECRUIT_SCHOOL_SUMMARY_LIST_INIT", {
					type: this.$route.query.type || '1'
				});
			}).catch(err => {
			});
		},
		handleClickMore(name) {
			const obj = {
				'edit': () => this.$router.push(getHashUrl(`/hr/recruit/school/summary/${name}`, { type: this.type })),
				'identify': () => this.$router.push(getHashUrl(`/hr/recruit/school/${name}`, {})),
				'export': () => this.handleOutput(),
				'selectTitle': this.handleSelectTitle
			};
			let fn = obj[name];
			fn();
		}
	}
};

</script>

<style lang="scss" scoped>
.hr-recruit-school-summary-filter {
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
