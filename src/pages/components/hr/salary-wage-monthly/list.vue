<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns.length ? columns : basicColumns"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight}"
		mode="table"
		class="g-m-t-20 v-hr-salary-wage-monthly-list"
		@page-change="handlePageChange"
		@page-size-change="handleChangePageSize"
		@selection-change="handleSelectionChange"
	>
		<div v-if="depart_id.length" slot="extra">

			<i-checkbox
				v-model="isAll"
				@on-change="handleIsAll">
				全选
			</i-checkbox>

			<vc-debounce-click
				class="g-gray-btn-line"
				@click="handleMultiAdjust">
				调整
			</vc-debounce-click>

		</div>
	</vc-paging>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import moment from 'moment';
import { PModal } from './popup/modal.vue';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
	},
	mixins: [
		item,
		checkAll,
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 36 })
	],
	data() {
		const { query } = this.$route;

		return {
			columns: [],
			initMonth: '',
			firstState: true
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrSalaryWageMonthly.listInfo;
		},
		depart_id() {
			return this.$store.state.hrSalaryWageMonthly.depart_id;
		},
		month() {
			return this.$store.state.hrSalaryWageMonthly.month;
		}
	},
	watch: {
		// // 根据是否选择部门来展示选择框
		depart_id(newVal, oldVal) {
			let hasCheckbox;
			this.columns = [...this.basicColumns];
			if (this.columns.length) {	// 初始化columns之后的操作
				hasCheckbox = this.columns.filter(it => it.type === 'selection');
				this.$forceUpdate();
				if (newVal.length) {	// 有部门
					hasCheckbox.length ? '' : this.columns.splice(0, 0, {
						type: 'selection',
						width: 60,
						fixed: "left",
					});
				} else {	// 无部门
					hasCheckbox.length ? this.columns.splice(0, 1) : '';
				}
			}
		}
	},
	mounted() {
		let { query = {} } = getParseUrl();
		let id;
		if (query.depart_id) {
			id = typeof query.depart_id === 'number' ? [query.depart_id] : query.depart_id.split(',').map((it) => Number(it));
			this.$store.commit('HR_SALARY_WAGE_MONTHLY_SET_DEPART_ID', id);
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_SALARY_WAGE_MONTHLY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					month: query.month ? query.month : this.month
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_SALARY_WAGE_MONTHLY_LIST_INIT');
		},
		// 点击全选
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		// 点击调整
		handleMultiAdjust() {
			if (this.selected.length) {
				const { query } = this.$route;
				let month = query.month ? query.month : moment();

				// 调整被选元素薪资
				PModal.popup({
					data: {
						action: 'adjust-all',
						selected: this.selected,
						month
					}
				}).then(res => {
					this.isAll = false;
				}).catch(() => {});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
		loadTableTitle(type) {
			const { query } = this.$route;
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: '1',
					scenario: 8
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_SALARY_WAGE_MONTHLY_TITLE_CHANGE', { ...res.data });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};

</script>

