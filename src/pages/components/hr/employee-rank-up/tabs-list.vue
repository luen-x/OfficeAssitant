<template>
	<div class="v-hr-employee-rank-up g-relative">
		<div class="js-filter">
			<div class="g-flex g-jc-sb ">
				<div class="g-flex g-ai-c">
					<i class="iconfont icon-fl-zuzhi g-c-red-mid g-fs-20" />
					<i-select
						:value="stair_depart_id"
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

				<div v-if="stair_depart_id && tabs.length">
					<vc-debounce-click
						v-if="isOpened && $auth[843]"
						class="g-red-btn-line g-m-r-5"
						@click="handleEdit">
						编辑周期
					</vc-debounce-click>
					<vc-debounce-click
						v-if="!isOpened && $auth[843]"
						class="g-red-btn-line g-m-r-5"
						@click="handleOpen">
						开启评定
					</vc-debounce-click>
					<vc-debounce-click
						v-if="showAdd && $auth[849]"
						class="g-red-btn-line g-m-r-5"
						@click="handleAdd">
						添加候选
					</vc-debounce-click>
					<i-dropdown trigger="hover" @on-click="handleClickMore">
						<div class="_more g-flex g-jc-sb">
							更多
							<i class="iconfont icon-triangle-down g-fs-14 g-pointer" />
						</div>
						<i-dropdown-menu slot="list">
							<i-dropdown-item v-if="$auth[844]" name="output">导出列表</i-dropdown-item>
							<i-dropdown-item v-if="$auth[845]" name="rule">晋升规则</i-dropdown-item>
						</i-dropdown-menu>
					</i-dropdown>
				</div>

			</div>
		</div>
		<div
			v-if="stair_depart_id && tabs.length"
			class="g-m-t-20">
			<div>
				<i-input
					v-model="search.search"
					:maxlength="15"
					style="width: 300px;"
					class="g-m-r-5"
					clearable
					placeholder="请输入员工姓名/手机号"
					@on-enter="handleSearch"
					@on-change="handleInputChange"/>

				<i-button
					type="primary"
					class="g-m-l-10"
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
			<vc-expand ref="expand" v-model="show" class="js-filter">
				<div
					class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
					style="padding-top: 3px;padding-bottom: 7px;">

					<i-select
						v-model="search.cycle_year"
						placeholder="请选择查询年份"
						style="width: 220px;"
						class="g-m-r-5"
						clearable
						transfer
						@on-change="handleYearChange">
						<i-option
							v-for="item in yearList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
					<i-select
						v-model="search.cycle_id"
						placeholder="请选择考核周期"
						style="width: 220px;"
						class="g-m-r-5"
						clearable
						transfer
						@on-change="handleCycleChange">
						<i-option
							v-for="item in cycleList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
					<i-select
						v-model="search.status"
						placeholder="请选择评定结果"
						style="width: 220px;"
						class="g-m-r-5"
						clearable
						transfer
						@on-change="handleSearch">
						<i-option
							v-for="item in upResult"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
					<i-cascader
						:data="departList"
						v-model="search.depart_id"
						:change-on-select="true"
						placeholder="请选择部门"
						trigger="click"
						clearable
						transfer
						style="width: 220px;display:inline-block"
						class="g-m-r-5"
						@on-change="handleSearch"/>
				</div>
			</vc-expand>
		</div>

		<i-tabs
			v-if="stair_depart_id && tabs.length"
			:value="system_id"
			:animated="false"
			type="card"
			class="g-tabs-card _tabs"
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.system_id"
				:label="(e) => label(e, item)"
				:name="item.system_id + ''"
			>
				<vc-paging
					:columns="columns"
					:show="item.system_id == system_id"
					:type="item.system_id"
					:data-source="listInfo[item.system_id].data"
					:total="listInfo[item.system_id].total"
					:reset="listInfo[item.system_id].reset"
					:current.sync="current[item.system_id]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight}"
					class="v-hr-employee-rank-up-list"
					mode="table"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
		</i-tabs>


		<!-- 尚未设置级称时 -->
		<div
			v-if="!stair_depart_id || tabs.length === 0"
			class="_norank g-flex g-fd-c g-jc-c g-ai-c">
			<img :src="norankUrl">
			<span>该部门尚未设置晋升体系，敬请期待！</span>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { Paging, Expand } from "wya-vc";
import { OSS_INVOICE_EMPTY } from '@constants/constants';
import { getParseUrl, getHashUrl, formatMoment, getItem, initTreeData } from "@utils/utils";
import { services, staffByMutiTerm, stairDepart, promoSys } from '@stores/services/hr';
import { Button, Cascader, DatePicker, Input, Select, Option, Tabs, TabPane,
		 Dropdown, DropdownMenu, DropdownItem, Tooltip } from "iview";
import { tableHeight } from '@extends/mixins/tableHeight';
import { addPModal } from './popup/add';
import { modifyPModal } from './popup/modify';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		"vc-paging": Paging,
		'vc-expand': Expand,
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
	},
	mixins: [
		item,
		services.upResult(),
		stairDepart(),
		promoSys,
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 100 })
	],
	data() {
		const { query } = this.$route;

		return {
			system_id: String(query.system_id || ""), // 同tabs下的value
			isOpened: false,
			more: '',
			showAdd: false,
			search: {
				search: query.search || '',
				cycle_year: query.cycle_year ? Number(query.cycle_year) : '',
				cycle_id: query.cycle_id ? Number(query.cycle_id) : '',
				status: Number(query.status),
				depart_id: query.depart_id ? query.depart_id.split(',').map((item1) => Number(item1)) : []
			},
			current: {},
			show: false,
			yearList: [],
			cycleList: [],
			departList: [],
			norankUrl: OSS_INVOICE_EMPTY,
			label: (h, info) => {
				return (
					<div>
						{ (info.abbreviation || info.full_name) ? <Tooltip transfer maxWidth="200">
							<span>{`${info.abbreviation}`}</span>
							<div slot="content">{info.full_name ? info.full_name : info.abbreviation}</div>
						</Tooltip> : '' }
					</div>
				);
			}
		};
	},
	computed: {
		stairList() {
			return this.$store.state.hrEmployeeRankUp.stairList;
		},
		stair_depart_id() {
			return this.$store.state.hrEmployeeRankUp.stair_depart_id;
		},
		tabs() {
			return this.$store.state.hrEmployeeRankUp.tabs;
		},
		listInfo() {
			return this.$store.state.hrEmployeeRankUp.listInfo;
		}
	},
	watch: {
		// 一级部门
		stairList(newVal, oldVal) {
			const { query } = this.$route;
			this.$store.commit('HR_EMPLOYEE_RANK_UP_SET_STAIR', query.stair_depart_id ? +query.stair_depart_id : newVal[0].depart_id);
			this.loadPromoSys(this.stair_depart_id);
			// 加载部门
			this.loadDepartList(this.stair_depart_id);
		},
		// tab数组变化
		tabs(newVal, oldVal) {
			const { query } = this.$route;
			this.system_id = String(query.system_id || (newVal[0] || {}).system_id);

			// 判断周期是否开启
			this.loadCycleStatus();
			// 加载周期年份数组
			this.loadUpYear();
			// 加载周期数组
			this.loadUpCycle();

			if (newVal.length) {
				this.$emit('handleLengthChange');
			}
		},
		stair_depart_id(newVal, oldVal) {
			// 加载部门
			this.loadDepartList(newVal);
		}
	},
	methods: {
		// 判断当前体系关系的周期是否开启
		loadCycleStatus() {
			if (this.system_id !== 'undefined' && this.system_id) {
				this.$request({
					url: '_HR_EMPLOYEE_UP_CYCLE_STATUS_GET',
					type: 'GET',
					param: {
						system_id: this.system_id
					},
					loading: false
				}).then((res) => {
					this.isOpened = res.data.is_start === 1;
				}).catch((error) => {});
			}
		},
		// 获取二级tab
		loadPromoSys(depart_id) {
			this.request({
				url: 'HR_UP_RELATION_GET',
				type: 'GET',
				param: {
					first_depart_id: depart_id
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {});
		},
		// 加载周期年份数组
		loadUpYear() {
			if (this.system_id !== 'undefined' && this.system_id) {
				this.$request({
					url: '_HR_EMPLOYEE_UP_YEAR_GET',
					type: "GET",
					param: {
						system_id: this.system_id,
					},
					loading: false
				}).then(res => {
					this.yearList = res.data;
				}).catch(error => {});
			}
		},
		// 加载周期数组
		loadUpCycle() {
			if (this.system_id !== 'undefined' && this.system_id) {
				this.$request({
					url: '_HR_EMPLOYEE_UP_CYCLE_GET',
					type: "GET",
					param: {
						system_id: this.system_id,
						cycle_year: this.search.cycle_year
					},
					loading: false
				}).then(res => {
					this.cycleList = res.data;
					this.loadNowCycle();
				}).catch(error => {});
			}
		},
		// 加载默认周期
		loadNowCycle() {
			this.$request({
				url: '_HR_EMPLOYEE_UP_NOW_CYCLE_GET',
				type: "GET",
				param: {
					system_id: this.system_id,
				},
				loading: false
			}).then(res => {
				this.search.cycle_id = res.data.cycle_id ? res.data.cycle_id : '';
				if (res.data.cycle_id) {
					let year = this.cycleList.filter(it => it.value === res.data.cycle_id)[0].label;
					this.search.cycle_year = +year.split('.')[0];
					this.handleCycleChange(res.data.cycle_id);
				}
			}).catch(error => {});
		},
		// 加载部门
		loadDepartList(id) {
			if (id) {
				this.$request({
					url: "_HR_DEPART_ALL_GET",
					type: "GET",
					param: {
						depart_id: id
					},
					loading: false
				}).then(res => {
					this.departList = Array.isArray(res.data) ? initTreeData(
						res.data,
						"depart_id",
						"depart_name"
					) : [];
				}).catch(error => {});
			} else {
				this.departList = [];
				this.search.depart_id = '';
			}
		},
		// 加载列表数据
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_RANK_UP_LIST_GET',
				type: 'GET',
				param: {
					...query,
					...this.search,
					system_id: this.system_id,
					first_depart_id: this.stair_depart_id,
					page,
					pageSize
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
			});
		},
		// 一级部门发生变化时
		handleStairChange(sed) {
			this.$store.commit('HR_EMPLOYEE_RANK_UP_SET_STAIR', sed);
			// 加载tab
			this.loadPromoSys(sed);
			// 判断周期是否开启
			this.loadCycleStatus();
			// 加载周期年份数组
			this.loadUpYear();
			// 加载周期数组
			this.loadUpCycle();
			// 清空筛选项
			this.search.search = '';
			this.search.cycle_year = '';
			this.search.cycle_id = '';
			this.search.status = '';
			this.search.depart_id = [];

			let { query = {} } = getParseUrl();
			query = {
				page: query.page,
				pageSize: query.pageSize,
				stair_depart_id: this.stair_depart_id
			};
			this.$router.replace(
				getHashUrl("/hr/employee/rank/up", { ...query })
			);
		},
		// tab切换
		handleChange(systemId) {
			this.system_id = systemId;
			// 判断周期是否开启
			this.loadCycleStatus();
			// 加载周期年份数组
			this.loadUpYear();
			// 加载周期数组
			this.loadUpCycle();
			// 清空周期及周期年份
			this.search.cycle_year = '';
			this.search.cycle_id = '';

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				system_id: systemId,
				cycle_year: '',
				cycle_id: '',
				page: this.current[systemId]
			};
			this.$router.replace(getHashUrl('/hr/employee/rank/up', { ...query }));
		},
		// 周期年份变化加载相应周期
		handleYearChange(value) {
			this.handleSearch();
			if (!value) {
				this.search.cycle_id = '';
				this.cycleList = [];
			} else {
				this.loadUpCycle();
			}
		},
		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_RANK_UP_LIST_INIT', this.system_id);
		},
		// 点击更多下拉框
		handleClickMore(value) {
			if (value === 'output') { // 导出列表
				let { query = {} } = getParseUrl();

				const url = getHashUrl(API_ROOT['HR_EMPLOYEE_RANK_UP_LIST_GET'], {
					...query,
					system_id: this.system_id,
					first_depart_id: this.stair_depart_id,
					is_export: 1,
					'-token': getItem(`staff_${this.$global.version}`).token
				});
				window.open(url);
			} else {
				this.$router.push(getHashUrl(
					'/hr/employee/rank/up/rule',
					{
						depart_name: (this.stairList && this.stairList.length && this.stair_depart_id)
									 ? this.stairList.filter(data => data.depart_id === +this.stair_depart_id)[0].depart_name : '',
						depart_id: this.stair_depart_id ? this.stair_depart_id : '',
						system_id: this.system_id,
					}
				));
			}
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 周期变化
		handleCycleChange(value) {
			this.handleSearch();
			if (value) {
				this.$request({
					url: '_HR_EMPLOYEE_UP_SHOW_ADD_GET',
					type: "GET",
					param: {
						cycle_id: value,
					},
					loading: false
				}).then(res => {
					this.showAdd = res.data.is_edit === 1;
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			} else {
				this.showAdd = false;
			}
		},
		// toggle
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleEdit() {
			// 编辑周期
			modifyPModal.popup({
				system_id: this.system_id,
				cycle_id: this.search.cycle_id,
				type: 'edit'
			}).then(res => {
				this.$store.commit("HR_EMPLOYEE_RANK_UP_LIST_INIT", this.system_id);
			}).catch(err => {});
		},
		handleOpen() {
			// 开启评定
			modifyPModal.popup({
				system_id: this.system_id,
				type: 'open'
			}).then(res => {
				this.isOpened = true;
				this.$store.commit("HR_EMPLOYEE_RANK_UP_LIST_INIT", this.system_id);
			}).catch(err => {});
		},
		handleAdd() {
			// 添加候选人
			addPModal.popup({
				data: {
					system_id: this.system_id,
					first_depart_id: this.stair_depart_id,
					cycle_id: this.search.cycle_id
				}
			}).then(res => {
				this.$store.commit("HR_EMPLOYEE_RANK_UP_LIST_INIT", this.system_id);
			}).catch(err => {});
		},
		// 搜索
		handleSearch: lodash.debounce(function () {
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync

			query = {
				...query,
				...this.search,
				depart_id: this.search.depart_id.length ? this.search.depart_id : null,
			};

			this.$router.replace(
				getHashUrl("/hr/employee/rank/up", { ...query })
			);
			this.$store.commit("HR_EMPLOYEE_RANK_UP_LIST_INIT", this.system_id);
		}, 300),
	}
};

</script>

<style lang="scss" scoped>
.v-hr-employee-rank-up {
	._more {
		width: 80px;
		color:#f14b5f;
		padding-left: 15px;
		padding-right: 15px;
		line-height: 30px;
		border: 1px solid #f14b5f;
		border-radius: 4px;
	}
	._norank {
		height: 650px;
		img {
			margin-bottom: 50px;
		}
	}
}
</style>

<style lang="scss">
.v-hr-employee-rank-up {
	._tabs {
		.ivu-tabs-bar .ivu-tabs-nav-container {
			.ivu-tabs-nav-scrollable {
				padding: 0 30px;
			}
			.ivu-tabs-nav-scroll-disabled {
				display: none !important;
			}
			.ivu-tabs-nav-prev, .ivu-tabs-nav-next {
				display: inline-block;
				width: 30px;
				text-align: center;
				border-top: 1px solid #dcdee2;
				border-left: 1px solid #dcdee2;
				border-top-left-radius: 4px;
			}
			.ivu-tabs-nav-next {
				border-right: 1px solid #dcdee2;
				border-top-left-radius: 0;
				border-top-right-radius: 4px;
			}
			.ivu-tabs-tab:nth-child(2) {
				border-radius: 0 0 0 0 !important;
			}
			.ivu-tabs-tab:last-child {
				border-radius: 0 0 0 0 !important;
			}
			.ivu-tabs-nav-scroll-disabled + .ivu-tabs-nav-scroll .ivu-tabs-nav > .ivu-tabs-tab:nth-child(2) {
				border-top-left-radius: 4px !important;
			}
			.ivu-tabs-nav-scroll-disabled + .ivu-tabs-nav-scroll .ivu-tabs-nav > .ivu-tabs-tab:last-child {
				border-top-right-radius: 4px !important;
			}
		}
	}
}
</style>
