<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		class="v-statistic-business-sale-rank"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label" 
			:name="item.value"
		>
			<div class="g-m-b-20">
				<i-select
					v-if="+item.value === 3"
					v-model="search.staff_id"
					filterable
					transfer
					clearable
					placeholder="请输入员工姓名"
					style="width:220px;"
					class="g-m-r-10"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in staffList"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="search.time_type"
					transfer
					style="width:220px;"
					class="g-m-r-10"
					@on-change="handleSelectChange"
				>
					<i-option
						v-for="item in dateLabel"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<oa-mix-picker
					v-model="time"
					:type="+search.time_type"
					:season-tree="seasonTree"
					class="g-m-r-10"
					style="width: 220px;"
					@change="handleDateChange"
				/>

				<i-select
					v-if="+item.value === 1"
					v-model="search.depart_id"
					transfer
					clearable
					style="width:220px;"
					class="g-m-r-10"
					placeholder="请选择战区"
					@on-change="handleDepartSearch"
				>
					<i-option
						v-for="item in zoneList"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-cascader
					v-if="+item.value === 2"
					v-model="departId"
					:data="departList"
					:change-on-select="true"
					clearable
					transfer
					trigger="click"
					placeholder="请选择部门"
					style="width: 220px;"
					class="g-m-r-10"
					@on-change="handleDepartChange"
				/>

				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-5 g-red-btn-small"
					style="width: 60px;height:32px"
					@click="handleSearch"
				>
					搜索
				</vc-debounce-click>
			</div>

			<div v-if="+companyGoal.is_business === 0" class="g-b g-pd-lr-20 g-pd-tb-20 g-m-b-20">
				<i-radio-group 
					v-model="amountType" 
					type="button"
					@on-change="handleRadioChange"
				>
					<i-radio label="1">
						成交金额
					</i-radio>
					<i-radio label="2">
						实际业绩
					</i-radio>
				</i-radio-group>
				<oa-goal
					:data-source="companyGoal"
					:amount-type="amountType" 
					class="_goal"
				/>
			</div>

			<vc-paging
				:columns="columns[item.value]"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-statistic-business-sale-rank-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@sort-change="handleSortChange"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Select, Option, Input, DatePicker, Button, RadioGroup, Radio, Cascader } from 'iview';
import { Paging } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, formatNumBatch } from '@utils/utils';
import moment from 'moment';
import { services } from '@stores/services/sale';
import { tableHeight } from '@extends/mixins/tableHeight';
import { findTreePath } from '@components/hr/_common/academy-course/util';
import item from './item';
import Goal from '../_common/goal';
import MixPicker, { getInitTime, getTargetSeasonTree } from '../_common/mix-picker';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-date-picker': DatePicker,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-cascader': Cascader,
		'oa-goal': Goal,
		'oa-mix-picker': MixPicker
	},
	mixins: [
		item, 
		services.departAll(), 
		services.firstDepartId(), 
		tableHeight({ expand: false, nav2: false, extra: 44, extraClass: ['_goal'] }),
		services.targetSeason()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.whose - 1 || "1"), // 同tabs下的value
			search: {
				time_type: String(query.time_type || "2"), // 时间类型 4月度 3季度 2年度
				depart_id: Number(query.depart_id) || null,
				staff_id: Number(query.staff_id) || null,
				sort: ""
			},
			time: {
				year: +(query.year || moment().format("YYYY")),
				month: query.month || moment().format("YYYY-MM"),
				season: [query.season.split(",")[0], +query.season.split(",")[1]]
			},
			current: {},
			tabs: [
				{ label: '战区排名', value: '1' }, 
				{ label: '部门排名', value: '2' }, 
				{ label: '员工排名', value: '3' }
			],
			dateLabel: [
				{
					label: '年度',
					value: '2'
				},
				{
					label: '季度',
					value: '3'
				},
				{
					label: '月度',
					value: '4'
				}
			],
			seasonTree: [],
			departId: [],
			staffList: [],
			amountType: String(query.amount_type || '1'),
			companyGoal: {},
			formatConfig: [
				'pay_performance',
				{ key: 'pay_rate', precision: 2, suffix: '%' },
				'real_performance',
				{ key: 'real_rate', precision: 2, suffix: '%' },
				'average_performance',
				{ key: 'min_target', precision: 2, suffix: '万' },
				{ key: 'target', precision: 2, suffix: '万' },
				{ key: 'max_target', precision: 2, suffix: '万' }
			],
			
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticBusinessSaleRank.listInfo;
		},
		zoneList() {
			if (this.firstDepartId.sale && this.firstDepartId.bs) {
				const sale = this.departAll.find(dep => dep.value == this.firstDepartId.sale);

				if (!sale) {
					return [];
				}

				const deps = sale.children.map(it => ({ value: it.value, label: it.label }));
				deps.unshift({ value: this.firstDepartId.bs, label: '商学院' });

				return deps; 
			} else {
				return [];
			}
		},
		departList() {
			if (this.firstDepartId.sale && this.firstDepartId.bs) {
				const sale = this.departAll.find(dep => dep.value == this.firstDepartId.sale);
				const bs = this.departAll.find(dep => dep.value == this.firstDepartId.bs);

				return sale ? [...bs.children, ...sale.children] : [];
			} else {
				return [];
			}
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	async created() {
		await this.loadTargetSeasonPromise;
		const season = getTargetSeasonTree(this.targetSeason);
		this.seasonTree = season.tree;

		 if (+this.$route.query.whose === 3 && this.$route.query.depart_id) {
			findTreePath(this.$route.query.depart_id, this.departAll) 
			&& findTreePath(this.$route.query.depart_id, this.departAll).forEach((element, index) => {
				if (index > 0) {
					this.departId.push(element);
				}
			});
		}

		this.loadStaffData();
		this.loadGoalData();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let year = +this.search.time_type === 2 ? this.time.year : '';
			let configId = +this.search.time_type === 3 && this.time.season ? this.time.season[1] : '';
			let month = +this.search.time_type === 4 ? moment(this.time.month).format('YYYY-MM') : '';
			let departId = '';
				
			if (+this.type === 1) {
				departId = this.search.depart_id;
			} else if (+this.type === 2) {
				if (this.departId.length > 0) {
					departId = this.departId[this.departId.length - 1];
				} else if (query.depart_id) {
					departId = query.depart_id;
				}
			}

			const param = {
				...query,
				...this.search,
				depart_type: this.type,
				depart_id: departId,
				type: this.type,
				year,
				config_id: configId,
				month,
				season: '',
				whose: '',
				page,
				pageSize
			};
			return this.request({
				url: 'STATISTIC_BUSINESS_SALE_RANK_LIST_GET',
				type: 'GET',
				param,
				initList: (list) => {
					return formatNumBatch(list, this.formatConfig);
				}
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		loadStaffData() {
			this.$request({
				url: "_SALE_PAYMENT_STAFF_LIST_GET",
				type: "GET",
				loading: false,
				param: {
					is_page: 0,
					is_charge: 1,
					is_leave: 0
				}
			}).then(res => {
				res.data.list.forEach(element => {
					this.staffList.push({
						label: `${element.staff_name}(${element.depart_name})/${element.mobile}`,
						value: element.staff_id
					});
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadGoalData() {
			const { query } = this.$route;
			let departId = '';
				
			if (+this.type === 1) {
				departId = this.search.depart_id;
			} else if (+this.type === 2) {
				if (this.departId.length > 0) {
					departId = this.departId[this.departId.length - 1];
				} else if (query.depart_id) {
					departId = query.depart_id;
				}
			}

			const param = {
				whose: query.whose,
				amount_type: this.amountType,
				time_type: this.search.time_type,
				year: +this.search.time_type === 2 ? this.time.year : '',
				config_id: +this.search.time_type === 3 ? this.time.season[1] : '',
				month: +this.search.time_type === 4 ? moment(this.month).format("YYYY-MM") : '',
				...this.search,
				depart_id: departId
			};
			
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_TARGET_GET',
				type: "GET",
				param,
				loading: false
			}).then(res => {
				this.companyGoal = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(type) {
			const { query } = this.$route;
			this.type = type;

			this.search = {
				time_type: String(query.time_type || "2"),
				depart_id: "",
				staff_id: "",
				sort: ""
			};

			this.departId = [];
			this.handleSearch();
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_LIST_INIT');
		},
		handleSearch() {
			this.loadGoalData();
			if ((+this.search.time_type === 2 && !this.time.year) || (+this.search.time_type === 4 && !this.time.month)) {
				return;
			}
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_LIST_INIT', { type: this.type });

		},
		handleDepartChange(selection) {
			this.departId = selection;
			this.handleSearch();
		},
		handleDateChange(value) {
			this.time = value;
			this.handleSearch();
		},
		handleSelectChange() {
			this.handleSearch();
		},
		handleSortChange({ key, order }) {
			let obj = {
				'pay_performance_desc': 1,
				'pay_performance_asc': 2,
				'real_performance_desc': 3,
				'real_performance_asc': 4
			};

			this.search.sort = obj[`${key}_${order}`];
			this.handleSearch();
		},
		handleRadioChange() {
			this.loadGoalData();
		},
		handleDepartSearch() {
			this.handleSearch();
		}
	}
};
</script>

<style lang="scss">
.v-statistic-business-sale-rank{
	.ivu-radio-wrapper:first-child{
		margin-right: 0px;
	}
}
</style>