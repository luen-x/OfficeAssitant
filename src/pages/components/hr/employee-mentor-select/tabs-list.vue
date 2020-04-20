<template>
	<div class="v-hr-employee-mentor-select g-relative">
		<div class="g-flex g-jc-sb hr-employee-rank-promo-depart">
			<div class="g-flex g-ai-c">
				<i class="iconfont icon-fl-zuzhi g-c-red-mid g-fs-20" />
				<i-select
					:value="query.first_depart_id"
					placeholder="请选择部门"
					clearable
					transfer
					style="width: 220px;"
					class="g-m-l-15"
					@on-change="handleStairChange">
					<i-option
						v-for="item in stairList"
						:key="item.depart_id"
						:value="item.depart_id">
						{{ item.depart_name }}
					</i-option>
				</i-select>
			</div>
		</div>
		<div v-if="!is_empty">
			<div class="js-filter g-m-t-20">
				<div>
					<i-input
						v-model="query.search"
						:maxlength="11"
						style="width: 300px"
						placeholder="请输入姓名/手机/工号"
						clearable
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>
					<i-button
						type="primary"
						class="g-m-l-5"
						@click="handleSearch"
					>
						搜索
					</i-button>
					<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
						更多搜索条件
						<i
							:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
							class="iconfont g-fs-12 g-c-black-dark"
						/>
					</span>
					<div class="g-fr" >
						<div v-if="$auth['912']" class="g-red-btn-line" @click="handleCandidate">添加候选</div>
						<div v-if="$auth['911']" class="g-red-btn-line g-m-l-5" @click="handleExport">导出列表</div>
					</div>
				</div>
				<vc-expand ref="expand" v-model="show">
					<div
						class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
						style="padding-top: 3px;padding-bottom: 7px;"
					>
						<i-select
							v-model="query.cycle_year"
							placeholder="请选择查询年份"
							style="width: 220px"
							clearable
							transfer
							class="g-m-r-5"
							@on-change="handleCycleYear"
						>
							<i-option
								v-for="item in cycleYearArr"
								:key="item.value"
								:value="String(item.value)"
							>{{ item.label }}</i-option>
						</i-select>
						<i-select
							v-model="query.cycle_id"
							placeholder="请选择评定周期"
							style="width: 220px"
							clearable
							transfer
							class="g-m-r-5"
							@on-change="handleCycleList"
						>
							<i-option
								v-for="item in cycleListArr"
								:key="item.value"
								:value="String(item.value)"
							>{{ item.label }}</i-option>
						</i-select>
						<i-cascader
							:data="departAll"
							v-model="query.depart_id"
							:change-on-select="true"
							placeholder="请选择部门"
							trigger="click"
							clearable
							transfer
							style="width: 220px;display:inline-block"
							class="g-m-r-5"
							@on-change="handleDepartChange"
						/>
						<i-select
							v-model="query.position_id"
							placeholder="请选择职位"
							style="width: 220px"
							clearable
							transfer
							class="g-m-r-5"
							@on-change="handleSearch"
						>
							<i-option
								v-for="item in positionList"
								:key="item.position_id"
								:value="item.position_id"
							>{{ item.position_name }}</i-option>
						</i-select>
					</div>
				</vc-expand>
			</div>
			<i-tabs 
				:value="type" 
				:animated="false"
				type="card" 
				style="margin-top: 20px"
				@on-click="handleChange"
			>
				<i-tab-pane 
					v-for="(item,index) in tabs"
					:key="item.value"
					:label="`${item.label} ${count[index]}`" 
					:name="item.value"
				>
					<vc-paging
						v-if="query.first_depart_id"
						:columns="columns[item.value]"
						:show="item.value == type" 
						:type="item.value"
						:data-source="listInfo[item.value].data"
						:total="listInfo[item.value].total"
						:reset="listInfo[item.value].reset"
						:current.sync="current[item.value]"
						:table-opts="{height: tableHeight}"
						:history="true"
						:load-data="loadData"
						class="v-hr-employee-mentor-select-list"
						mode="table"
						@page-size-change="handleChangePageSize"
					/>
				</i-tab-pane>
			</i-tabs>
		</div>
		<div
			v-else
			class="_norank g-flex g-fd-c g-jc-c g-ai-c g-m-t-20">
			<img :src="norankUrl">
			<span>该一级部门下未设置师傅规则！</span>
		</div>
	</div>
</template>

<script>
import { Tabs, TabPane, Select, Option, Input, Button, DatePicker, Cascader } from 'iview';
import { Paging, Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { services, staffByMutiTerm } from "@stores/services/hr";
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { TableTitle } from '@components/_common/table-title/table-title';
import { OSS_INVOICE_EMPTY } from '@constants/constants';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import { DetailDrawer } from "./popup/detail";
import { AddMentor } from "./popup/add-mentor";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		"i-select": Select,
		"i-option": Option,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"i-input": Input,
		"i-button": Button,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"vc-expand": Expand
	},
	mixins: [
		item,
		services.departAll(), 
		staffByMutiTerm,
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 100 }),
		autoFix()
	],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			stairList: [], // 一级部门全部内容
			count: [0, 0, 0, 0],
			cycle_id: 0, // 周期id
			is_empty: false,
			norankUrl: OSS_INVOICE_EMPTY,
			tabs: [
				{ label: '待审核', value: '1' }, 
				{ label: '评选中', value: '2' }, 
				{ label: '已通过', value: '3' },
				{ label: '未通过', value: '4' }
			],
			query: {
				...query,
				search: query.search || '',
				position_id: Number(query.position_id),
				depart_id: query.depart_id ? query.depart_id.split(",").map(i => Number(i)) : [],
				cycle_year: query.cycle_year || '',
				cycle_id: String(query.cycle_id || this.cycle_id || ''),
				first_depart_id: Number(query.first_depart_id),
			},
			show: false,
			positionList: [],
			cycleYearArr: [],
			cycleListArr: [],
			create_time: [query.create_time_start, query.create_time_end],
			leave_time: [query.leave_time_start, query.leave_time_end]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrEmployeeMentorSelect.listInfo;
		}
	},
	created() {
		this.loadFirstDepart();
	},
	mounted() {
		if (this.query.depart_id.length) {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: "GET",
				loading: false
			}).then(res => {
				this.positionList = res.data.filter(i => i.depart_id === this.query.depart_id[0])[0].positions;
			}).catch(error => {});
		}
		if (this.query.cycle_id.length) { 
			this.loadCycleYearArr();
		}
	},
	methods: {
		// 加载一级部门
		loadFirstDepart(isMounted) {
			 this.$request({
				url: API_ROOT.HR_STAIR_DEPART_GET,
				type: 'GET',
			}).then((res) => {
				const { query } = this.$route;
				if (!query.first_depart_id) {
					this.query.first_depart_id = res.data[0].depart_id;
				}
				this.stairList = res.data;
				this.loadCycleYear();
				this.loadCycleYearArr();
				!query.cycle_id && this.loadNewCycle(this.query.first_depart_id);
			}).catch((error) => {
			});
		},
		// 获取默认周期id
		loadNewCycle(id) {
			let { query = {} } = getParseUrl();
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBOR_NEW_CYCLE_LIST_GET,
				type: 'GET',
				param: {
					first_depart_id: id || query.first_depart_id,
				},
			}).then((res) => {
				this.query.cycle_id = res.data.cycle_id + '';
				this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
			}).catch((error) => {
			});
		},
		// 加载周期年份数组
		loadCycleYear() {
			if (this.query.first_depart_id) {
				this.$request({
					url: API_ROOT._HR_PERSONNEL_MEMBOR_CYCLE_YEAR_GET,
					type: 'GET',
					param: {
						first_depart_id: this.query.first_depart_id
					},
					loading: false
				}).then((res) => {
					this.cycleYearArr = res.data;
					this.query.cycle_year = String(res.data[res.data.length - 1].value);
					this.handleCycleYear(this.query.cycle_year);
				}).catch((error) => {});
			}
		},
		// 加载周期下拉数组
		loadCycleYearArr() {
			if (this.query.first_depart_id) {
				this.$request({
					url: API_ROOT._HR_PERSONNEL_MEMBOR_CYCLE_LIST_GET,
					type: 'GET',
					param: {
						cycle_year: this.query.cycle_year,
						first_depart_id: this.query.first_depart_id
					},
					loading: false
				}).then((res) => {
					this.cycleListArr = res.data;
				}).catch((error) => {});
			}
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_MENTOR_SELECT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					first_depart_id: this.query.first_depart_id,
					page,
					pageSize
				},
			}).then((res) => {
				this.is_empty = false;
				let await_train_count = res.data.await_train_count; 
				let	evaluate_count = res.data.evaluate_count;
				let	success_count = res.data.success_count; 
				let	error_count = res.data.error_count;
				if (res.requestError) {
					this.is_empty = true;
				}
				this.count = [
					await_train_count,
					evaluate_count,
					success_count, 
					error_count
				];
				this.resetType('1', this.count, '/hr/employee/mentor/select');
			}).catch((error) => {
				this.is_empty = true;
				this.$Message.error(error.msg);
			});
		},
		handleStairChange(val) {
			this.query.first_depart_id = val;
			this.loadCycleYear();
			this.loadCycleYearArr();
			this.loadNewCycle(this.query.first_depart_id);
			let { query = {} } = getParseUrl();
			query = {
				...query,
				type: this.type,
				first_depart_id: this.query.first_depart_id,
			};
			this.$router.replace(getHashUrl('/hr/employee/mentor/select', { ...query }));
			this.loadData();
			// this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/employee/mentor/select', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
		},
		handleDepartChange(value, selected) {
			this.query.depart_id = value;
			if (value.length === 0) {
				this.query.position_id = '';
				this.positionList = [];
			} else {
				this.$request({
					url: API_ROOT._HR_DEPART_POSITION_GET,
					type: 'GET',
					loading: false
				}).then((res) => {
					value.length
						? this.positionList = res.data.filter(i => i.depart_id === value[0])[0].positions
						: '';
				}).catch((error) => {});
			}
			this.handleSearch();
		},
		// 周期变化
		handleCycleList(value) {
			this.query.cycle_id = value;
			this.handleSearch();
		},
		// 年份改变
		handleCycleYear(value) {
			this.query.cycle_year = value;
			if (value === undefined) {
				this.query.cycle_id = '';
				this.cycleListArr = [];
			} else {
				this.loadCycleYearArr();
			}
			this.handleSearch();
		},
		// 时间改变
		handleDateChange(val, name) {
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: debounce(function (event) {
			let { query = {} } = getParseUrl();
			this.$router.replace(getHashUrl(
				'/hr/employee/mentor/select', 
				{ 
					...this.query,
					type: this.type,
					fixPosition: true,
					depart_id: this.query.depart_id.length ? this.query.depart_id : null
				}
			));
			this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
		}, 500),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport() {
			if (!this.query.first_depart_id) {
				return false;
			}
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "1",
				
			};
			window.open(getHashUrl(API_ROOT.HR_EMPLOYEE_MENTOR_SELECT_LIST_GET, {
				...this.$route.query,
				...query,
				first_depart_id: this.$route.query.first_depart_id || this.query.first_depart_id,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleCandidate() {
			if (!this.query.first_depart_id) {
				return; 
			}
			AddMentor.popup({
				first_depart_id: this.query.first_depart_id
			}).then(res => {
				this.$store.commit('HR_EMPLOYEE_MENTOR_SELECT_LIST_INIT');
			});
		},
	}
};

</script>

<style lang="scss">
.v-hr-employee-mentor-select{
	._norank {
		height: 650px;
		img {
			margin-bottom: 50px;
		}
	}
}

</style>
