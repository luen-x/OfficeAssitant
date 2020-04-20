<template>
	<div class="v-hr-employee-rank-promo-record g-m-t-20">

		<div>
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

		<i-tabs
			v-if="stair_depart_id && tabs.length"
			:value="rank_system_id"
			:animated="false"
			type="card"
			class="g-tabs-card g-m-t-20"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item, index) in tabs"
				:key="item.rank_system_id"
				:label="item.system_name"
				:name="item.rank_system_id + ''">

				<div>
					<div>
						<i-input
							v-model="obj.search"
							:maxlength="15"
							style="width: 220px;"
							class="g-m-r-5"
							clearable
							placeholder="请输入员工姓名/手机号"
							@on-enter="handleSearch"
							@on-change="handleInputChange"/>

						<i-select
							v-model="obj.period_id"
							placeholder="请选择阶段"
							style="width: 220px;"
							clearable
							transfer
							@on-change="handlePeriodChange">
							<i-option
								v-for="item in periodList"
								:key="item.period_id"
								:value="item.period_id">
								{{ item.period_num }}
							</i-option>
						</i-select>

						<i-button
							type="primary"
							class="g-m-l-10"
							@click="handleSearch">
							搜索
						</i-button>

						<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle(index)">
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
								v-model="obj.rank_id"
								placeholder="请选择操作后职称"
								style="width: 220px;display: inline-block;"
								class="g-m-r-5"
								clearable
								transfer
								@on-change="handleSearch">
								<i-option
									v-for="item in scaleTitleList"
									:key="item.rank_id"
									:value="item.rank_id">
									{{ item.rank_name }}
								</i-option>
							</i-select>

							<i-cascader
								:data="departList"
								v-model="obj.depart_id"
								:change-on-select="true"
								placeholder="请选择部门"
								trigger="click"
								clearable
								transfer
								style="width: 220px;display:inline-block"
								class="g-m-r-5"
								@on-change="handleSearch"/>

							<i-select
								v-model="obj.position_id"
								placeholder="请选择职位"
								clearable
								transfer
								style="width: 220px;"
								class="g-m-r-5"
								@on-change="handleSearch">
								<i-option
									v-for="item in positionList"
									:key="item.position_id"
									:value="item.position_id">
									{{ item.position_name }}
								</i-option>
							</i-select>

							<i-select
								v-model="obj.is_up"
								placeholder="请选择操作类型"
								clearable
								transfer
								style="width: 220px;"
								class="g-m-r-5"
								@on-change="handleSearch">
								<i-option
									v-for="item in adjustList"
									:key="item.value"
									:value="item.value">
									{{ item.label }}
								</i-option>
							</i-select>

							<i-date-picker
								v-model="judge_time"
								type="daterange"
								clearable
								transfer
								split-panels
								placeholder="请选择操作时间"
								style="width: 220px;"
								class="g-m-r-5"
								@on-change="handleDateChange($event)" />

							<i-select
								v-model="obj.is_leave"
								placeholder="请选择离职情况"
								clearable
								transfer
								style="width: 220px;"
								@on-change="handleSearch">
								<i-option
									v-for="item in statusList"
									:key="item.value"
									:value="item.value">
									{{ item.label }}
								</i-option>
							</i-select>

						</div>
					</vc-expand>
				</div>

				<vc-paging
					:columns="columns"
					:show="item.rank_system_id == rank_system_id"
					:type="item.rank_system_id"
					:data-source="listInfo[item.rank_system_id].data"
					:total="listInfo[item.rank_system_id].total"
					:reset="listInfo[item.rank_system_id].reset"
					:current.sync="current[item.rank_system_id]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight}"
					class="v-hr-employee-rank-promo-record-list g-m-t-20"
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
			<span>该部门尚未设置级称，敬请期待！</span>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Paging, Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { tableHeight } from '@extends/mixins/table';
import { OSS_INVOICE_EMPTY } from '@constants/constants';
import { getParseUrl, getHashUrl, formatMoment, initTreeData } from "@utils/utils";
import { services, staffByMutiTerm, stairDepart, promoSys } from '@stores/services/hr';
import { Button, Cascader, DatePicker, Input, Select, Option, Tabs, TabPane } from "iview";
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
		"i-tab-pane": TabPane
	},
	mixins: [
		item,
		stairDepart(),
		promoSys,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
			extraHeight: 210
		})
	],
	data() {
		const { query } = this.$route;

		return {
			rank_system_id: String(query.rank_system_id || ""), // 同tabs下的value
			obj: {
				search: query.search || '',
				is_up: Number(query.is_up),
				is_leave: Number(query.is_leave),
				period_id: query.period_id ? Number(query.period_id) : '',
				rank_id: query.rank_id ? Number(query.rank_id) : '',
				position_id: Number(query.position_id),
				depart_id: query.depart_id ? query.depart_id.split(',').map((item1) => Number(item1)) : []
			},
			type: 1,	// 晋级体系
			current: {},
			show: false,
			departList: [],
			periodList: [],	// 	阶段
			scaleTitleList: [],	// 级称
			positionList: [],	// 职位
			norankUrl: OSS_INVOICE_EMPTY,
			judge_time: [query.start_date, query.stop_date],
			statusList: [
				{ label: '在职', value: 1 },
				{ label: '离职', value: 2 }
			],
			adjustList: [
				{ label: '晋级', value: 2 },
				{ label: '降级', value: 1 }
			]
		};
	},
	computed: {
		stairList() {
			return this.$store.state.hrEmployeeRankPromoRecord.stairList;
		},
		stair_depart_id() {
			return this.$store.state.hrEmployeeRankPromoRecord.stair_depart_id;
		},
		tabs() {
			return this.$store.state.hrEmployeeRankPromoRecord.tabs;
		},
		listInfo() {
			return this.$store.state.hrEmployeeRankPromoRecord.listInfo;
		}
	},
	watch: {
		// 一级部门
		stairList(newVal, oldVal) {
			const { query } = this.$route;
			this.$store.commit('HR_EMPLOYEE_RANK_PROMO_RECORD_SET_STAIR', query.stair_depart_id ? +query.stair_depart_id : newVal[0].depart_id);
			this.loadPromoSys(this.stair_depart_id, this.type);
			// 加载部门
			this.loadDepartList(this.stair_depart_id);
			// 加载职位
			this.loadPositionList(this.stair_depart_id);
		},
		tabs(newVal, oldVal) {
			const { query } = this.$route;
			this.rank_system_id = String(query.rank_system_id || (newVal[0] || {}).rank_system_id);

			// 加载阶段
			this.loadPeriodList();

			if (newVal.length) {
				this.$emit('handleLengthChange');
			}
		},
		stair_depart_id(newVal, oldVal) {
			// 加载部门
			this.loadDepartList(newVal);
			// 加载职位
			this.loadPositionList(newVal);
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_RANK_PROMO_RECORD_LIST_GET',
				type: 'GET',
				param: {
					...query,
					rank_system_id: this.rank_system_id,
					stair_depart_id: this.stair_depart_id,
					page,
					pageSize
				},
				loading: false
			})
				.then((res) => {})
				.catch((error) => {});
		},
		// 获取阶段下拉框
		loadPeriodList() {
			if (this.rank_system_id !== 'undefined' && this.rank_system_id) {
				this.$request({
					url: API_ROOT._HR_EMPLOYEE_RANK_PROMO_PERIOD_GET,
					type: "GET",
					param: {
						rank_system_id: this.rank_system_id,
					},
					loading: false
				}).then(res => {
					this.periodList = res.data;
					// 加载级称
					this.loadRankList();
				}).catch(error => {});
			}
		},
		// 获取级称下拉框
		loadRankList() {
			if (this.obj.period_id && !Number.isNaN(this.obj.period_id)) {
				this.$request({
					url: API_ROOT._HR_EMPLOYEE_RANK_PROMO_RANK_GET,
					type: "GET",
					param: {
						rank_system_id: this.rank_system_id,
						period_id: this.obj.period_id
					},
					loading: false
				}).then(res => {
					this.scaleTitleList = res.data;
				}).catch(error => {});
			}
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
				this.obj.depart_id = '';
			}
		},
		// 加载职位
		loadPositionList(id) {
			if (id) {
				this.$request({
					url: API_ROOT._HR_DEPART_POSITION_GET,
					type: 'GET',
					loading: false
				}).then((res) => {
					this.positionList = res.data.filter(it => it.depart_id === id)[0].positions;
				}).catch((error) => {});
			} else {
				this.positionList = [];
				this.obj.position_id = '';
			}
		},
		// 一级部门发生变化时
		handleStairChange(sed) {
			this.$store.commit('HR_EMPLOYEE_RANK_PROMO_RECORD_SET_STAIR', sed);
			// 加载tab
			this.loadPromoSys(sed, this.type);
			// 加载阶段
			this.loadPeriodList();
			// 清空筛选项
			this.obj.search = '';
			this.obj.period_id = '';
			this.obj.rank_id = '';
			this.obj.position_id = '';
			this.obj.depart_id = [];
			this.judge_time = [];

			let { query = {} } = getParseUrl();
			query = {
				page: query.page,
				pageSize: query.pageSize,
				stair_depart_id: this.stair_depart_id
			};
			this.$router.replace(
				getHashUrl("/hr/employee/rank/promo/record", { ...query })
			);
			// this.$store.commit("HR_EMPLOYEE_RANK_PROMO_RECORD_LIST_INIT", this.rank_system_id);
		},
		// tab变化
		handleChange(rankSystemId) {
			this.rank_system_id = rankSystemId;
			// 加载阶段
			this.loadPeriodList();
			// 清空阶段和级称
			this.obj.period_id = '';
			this.obj.rank_id = '';

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				period_id: '',
				rank_id: '',
				rank_system_id: rankSystemId,
				page: this.current[rankSystemId]
			};
			this.$router.replace(getHashUrl('/hr/employee/rank/promo/record', { ...query }));
		},
		// 阶段发生变化获取相应级称列表
		handlePeriodChange(value) {
			this.handleSearch();

			if (!value) {
				this.obj.rank_id = '';
				this.scaleTitleList = [];
			} else {
				this.loadRankList();
			}
		},
		// 时间改变
		handleDateChange(val) {
			this.obj.start_date = val[0];
			this.obj.stop_date = val[1];
			this.handleSearch();
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// page size发生变化时
		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_RANK_PROMO_RECORD_LIST_INIT', this.rank_system_id);
		},
		handleSearch: lodash.debounce(function () {
			let { query = {} } = getParseUrl();
			query = {
				...query,
				...this.obj,
				depart_id: this.obj.depart_id.length ? this.obj.depart_id : null,
			};
			this.$router.replace(
				getHashUrl("/hr/employee/rank/promo/record", { ...query })
			);
			this.$store.commit("HR_EMPLOYEE_RANK_PROMO_RECORD_LIST_INIT", this.rank_system_id);
		}, 300),
		// toggle
		handleToggle(index) {
			this.$refs.expand[index].toggle();
		}
	}
};

</script>

<style lang="scss" scoped>
.v-hr-employee-rank-promo-record {
	._norank {
		height: 650px;
		img {
			margin-bottom: 50px;
		}
	}
}
</style>
