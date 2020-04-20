<template>
	<div class="js-filter v-recruit-school-tryassign-filter">
		<div>
			<i-input
				v-model="search.search"
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
			<div class="g-fr _right-text">
				<span v-if="$route.query.type == undefined || $route.query.type == '1'">
					<i-dropdown
						v-if="listInfo.assign_type == 0"
						trigger="hover"
						@on-click="handleClickDispatch"
					>
						<div v-if="$auth[1729]" class="_more g-flex g-jc-sb g-m-r-5">
							开启分配
							<i class="iconfont icon-triangle-down g-fs-14 g-pointer" />
						</div>
						<i-dropdown-menu slot="list">
							<i-dropdown-item v-if="$auth[1730]" name="1">随机分配</i-dropdown-item>
							<i-dropdown-item v-if="$auth[1732]" name="2">总监分配</i-dropdown-item>
						</i-dropdown-menu>
					</i-dropdown>
					<div
						v-if="listInfo.assign_type !== 0 && $auth[1752]"
						class="g-red-btn-line g-m-r-5"
						@click="handleDetail"
					>
						分配结果
					</div>
				</span>
				<i-dropdown
					trigger="hover"
					@on-click="handleClickMore">
					<div class="_more g-flex g-jc-sb g-m-l-5">
						更多功能
						<i class="iconfont icon-triangle-down g-fs-14 g-pointer" />
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item v-if="$auth[703]" name="1">导出</i-dropdown-item>
						<i-dropdown-item name="2">选择表头</i-dropdown-item>
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
					v-model="search.college"
					placeholder="请输入毕业学校名称"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange" 
				/>

				<i-select
					v-model="search.position_id"
					transfer
					clearable
					filterable
					placeholder="请选择应聘岗位"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in recruitAllPosition"
						:key="item.position_id"
						:value="item.position_id">
						{{ item.position_name }}
					</i-option>
				</i-select>
				<i-input
					v-model="search.profession"
					placeholder="请输入专业"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange" 
				/>

				<!-- <i-select
					v-model="search.sex"
					transfer
					clearable
					placeholder="请选择性别"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in sexList"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select> -->

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

				<i-select
					v-model="search.is_ticket"
					transfer
					clearable
					placeholder="有无到杭车次"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option :value="1">有</i-option>
					<i-option :value="0">无</i-option>
				</i-select>

				<i-date-picker
					v-model="ticket_arrive_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择到杭时间"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'ticket_arrive_time')"
				/>

				<i-select
					v-model="search.education"
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


				<i-date-picker
					v-if="$route.query.type == '3' || $route.query.type == '2'"
					v-model="assign_time"
					type="datetimerange"
					format="yyyy-MM-dd HH:mm"
					transfer
					clearable
					split-panels
					placeholder="请选择试岗分配时间"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'assign_time')"
				/>

				<i-cascader
					v-if="$route.query.type == '3' || $route.query.type == '2'"
					:data="departAll"
					v-model="search.try_depart_id"
					:change-on-select="true"
					transfer
					clearable
					placeholder="请选择试岗部门"
					trigger="click"
					style="width: 220px;display: inline-block"
					class="g-m-r-5"
					@on-change="handleSearch" />

				<i-select
					v-if="$route.query.type == '3' || $route.query.type == '2'"
					v-model="search.scenario"
					transfer
					clearable
					placeholder="请选择指派类型"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option :value="1">校招随机</i-option>
					<i-option :value="2">总监分配</i-option>
					<i-option :value="3">三立学府分配</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Expand } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, formatMoment, getItem } from '@utils/utils';
import { Input, Button, Select, Option, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { services } from '@stores/services/hr';
import moment from 'moment';
import { TableTitle } from '@components/_common/table-title/table-title';
import { AllocateModal } from './popup/allocate-modal';

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		'vc-expand': Expand,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
	},
	mixins: [
		services.departAll(),
		services.recruitAllPosition(),
		services.education()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				...query,
				profession: query.profession || '',
				college: query.college || '',
				position_id: Number(query.position_id),
				sex: Number(query.sex),
				try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : [],
				is_ticket: +query.is_ticket || null,
				education: +query.education || null,
				scenario: +query.scenario || null,
				assign_time: [query.assign_time_start, query.assign_time_end],
			},
			show: false,
			reply_time: [query.reply_time_start, query.reply_time_end],
			ticket_arrive_time: [query.ticket_arrive_time_start, query.ticket_arrive_time_end],
			assign_time: [query.assign_time_start, query.assign_time_end],
			sexList: [
				{ label: '男', value: 0 },
				{ label: '女', value: 1 }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSchoolTryassign.listInfo;
		}
	},
	methods: {
		handleDetail() {
			if (this.listInfo.assign_type == 1) {
				this.$router.push('/hr/recruit/school/tryassign/random');
			} else {
				this.$router.push('/hr/recruit/school/tryassign/chief');
			}
		},
		handleClickDispatch(name) {
			this.listInfo.applicant_arr.length ? AllocateModal.popup({
				applicant: this.listInfo.applicant_arr,
				type: +name
			}).then(res => {
				this.$store.commit('HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_INIT');
			}).catch(err => err && console.error(err)) : this.$Message.warning('暂无人员可分配');
		},
		handleClickMore(name) {
			name === '1' && this.handleExport();
			name === '2' && this.handleSelectTitle();
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrRecruitSchoolTryassign.title[this.$route.query.type || "1"];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_RECRUIT_SCHOOL_TRYASSIGN_TITLE_CHANGE',
				type: this.$route.query.type || "1",
				scenario: 2
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit('hr-recruit-school-tryassign-title-change', { type: this.$route.query.type || "1" });
				this.$store.commit("HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_INIT", {
					type: this.$route.query.type || "1"
				});
			}).catch(err => {
			});
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/tryassign',
				{
					...this.$route.query,
					...this.search,
					assign_time_start: this.search.assign_time_start ? moment(this.search.assign_time_start).format("YYYY-MM-DD HH:mm") : '',
					assign_time_end: this.search.assign_time_end ? moment(this.search.assign_time_end).format("YYYY-MM-DD HH:mm") : '',
					fixPosition: true
				}
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_INIT');
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
			this.search[`${name}_start`] = val[0];
			this.search[`${name}_end`] = val[1];
			this.handleSearch();
		},
		// 导出当前状态下的所有员工
		handleExport() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_GET'], {
				...query,
				is_export: 1,
				type: query.type ? query.type : '1',
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		}
	}
};

</script>

<style lang="scss">
.v-recruit-school-tryassign-filter {
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
