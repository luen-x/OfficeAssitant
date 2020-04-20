<template>
	<div class="v-hr-employee-rank-statistics g-relative">
		<div class="js-filter">
			<div class="g-flex g-jc-sb">
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
				<vc-debounce-click
					v-if="$auth[855]"
					class="g-red-btn-line g-m-r-5"
					@click="handleOutput">
					导出列表
				</vc-debounce-click>

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

						<i-date-picker
							v-model="search.office_month"
							:options="dateOption"
							type="month"
							clearable
							transfer
							placeholder="请选择任职月份"
							style="width: 220px;"
							class="g-m-r-5"
							@on-change="handleDateChange"/>
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
		</div>
		<i-tabs
			v-if="stair_depart_id && tabs.length"
			:value="position_id"
			:animated="false"
			type="card"
			class="g-tabs-card"
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.position_id"
				:label="item.position_name"
				:name="item.position_id + ''"
			>
				<vc-paging
					ref="tableTarget"
					:columns="columns"
					:show="item.position_id == position_id"
					:type="item.position_id"
					:data-source="listInfo[item.position_id].data"
					:total="listInfo[item.position_id].total"
					:reset="listInfo[item.position_id].reset"
					:current.sync="current[item.position_id]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight}"
					class="v-hr-employee-rank-statistics-list"
					mode="table"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
		</i-tabs>

		<!-- 尚未设置级称时 -->
		<!-- <div
			v-if="!stair_depart_id || tabs.length === 0"
			class="_norank g-flex g-fd-c g-jc-c g-ai-c">
			<img :src="norankUrl">
			<span>该部门尚未设置级称，敬请期待！</span>
		</div> -->
	</div>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { Paging, Expand } from "wya-vc";
import { tableHeight } from '@extends/mixins/tableHeight';
import { OSS_INVOICE_EMPTY } from '@constants/constants';
import { getParseUrl, getHashUrl, formatMoment, getItem, initTreeData } from "@utils/utils";
import { services, staffByMutiTerm, stairDepart } from '@stores/services/hr';
import { Button, Cascader, DatePicker, Input, Select, Option, Tabs, TabPane, Tooltip } from "iview";
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
	},
	mixins: [
		item,
		stairDepart(),
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 0 })
	],
	data() {
		const { query } = this.$route;

		return {
			position_id: String(query.position_id || "-1"), // 同tabs下的value
			current: {},
			departList: [],
			show: false,
			dateOption: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
			},
			search: {
				search: query.search || '',
				office_month: query.office_month || '',
				depart_id: query.depart_id ? query.depart_id.split(',').map((item1) => Number(item1)) : []
			},
		};
	},
	computed: {
		stairList() {
			return this.$store.state.hrEmployeeRankStatistics.stairList;
		},
		stair_depart_id() {
			return this.$store.state.hrEmployeeRankStatistics.stair_depart_id;
		},
		tabs() {
			return this.$store.state.hrEmployeeRankStatistics.tabs;
		},
		listInfo() {
			return this.$store.state.hrEmployeeRankStatistics.listInfo;
		}
	},
	watch: {
		// 一级部门
		stairList(newVal, oldVal) {
			const { query } = this.$route;
			this.$store.commit('HR_EMPLOYEE_RANK_STATISTICS_SET_STAIR', query.stair_depart_id ? +query.stair_depart_id : newVal[0].depart_id);
			this.loadPosition(this.stair_depart_id);
			// 加载部门
			this.loadDepartList(this.stair_depart_id);
		},
		// tab数组变化
		tabs(newVal, oldVal) {
			const { query } = this.$route;
			this.position_id = String(query.position_id || (newVal[0] || {}).position_id);

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
		// 获取二级tab
		loadPosition(depart_id) {
			this.request({
				url: 'HR_STATISTICS_POSITION_GET',
				type: 'GET',
				param: {
					first_depart_id: depart_id
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {});
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
				url: 'HR_EMPLOYEE_RANK_STATISTICS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					position_id: this.position_id,
					first_depart_id: this.stair_depart_id,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
			});
		},
		// 一级部门发生变化时
		handleStairChange(sed) {
			this.$store.commit('HR_EMPLOYEE_RANK_STATISTICS_SET_STAIR', sed);
			// 加载tab
			this.loadPosition(sed);
			// 清空筛选项
			this.search.search = '';
			this.search.office_month = '';
			this.search.depart_id = [];

			let { query = {} } = getParseUrl();
			query = {
				page: query.page,
				pageSize: query.pageSize,
				stair_depart_id: this.stair_depart_id
			};
			this.$router.replace(
				getHashUrl("/hr/employee/rank/statistics", { ...query })
			);
		},
		// tab切换
		handleChange(positionId) {
			this.position_id = positionId;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				position_id: positionId,
				page: this.current[positionId]
			};
			this.$router.replace(getHashUrl('/hr/employee/rank/statistics', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_RANK_STATISTICS_LIST_INIT', this.position_id);
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// toggle
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleDateChange(value) {
			this.search.office_month = value;
			this.handleSearch();
		},
		// 搜索
		handleSearch: lodash.debounce(function () {
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync

			query = {
				...query,
				...this.search,
				office_month: formatMoment(this.search.office_month, 'YYYY-MM'),
				depart_id: this.search.depart_id.length ? this.search.depart_id : null,
			};

			this.$router.replace(
				getHashUrl("/hr/employee/rank/statistics", { ...query })
			);
			this.$store.commit("HR_EMPLOYEE_RANK_STATISTICS_LIST_INIT", this.position_id);
		}, 300),
		handleOutput() {
			let { query = {} } = getParseUrl();

			const url = getHashUrl(API_ROOT['HR_EMPLOYEE_RANK_STATISTICS_LIST_GET'], {
				...query,
				position_id: this.position_id,
				first_depart_id: this.stair_depart_id,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		}
	}
};

</script>

<style lang="scss">

</style>
