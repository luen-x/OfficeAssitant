<template>
	<i-tabs 
		:value="project_id" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item) in tabs"
			:key="item.project_id"
			:label="item.project_name" 
			:name="item.project_id + ''"
		>
			<vc-paging
				ref="tableTarget"
				:columns="getColumns(item.project_id)"
				:show="item.project_id == project_id" 
				:type="item.project_id"
				:data-source="listInfo[item.project_id].data"
				:total="listInfo[item.project_id].total"
				:reset="listInfo[item.project_id].reset"
				:current.sync="current[item.project_id]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: false}"
				class="v-tech-project-plan-demand-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div slot="extra" class="g-flex-ac">
					<i-checkbox 
						v-if="$auth[1418] || $auth[1419]"
						v-model="isAll" 
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<vc-debounce-click
						v-if="$auth[1418]"
						:tag="Button"
						@click="handleMultiProgress"
					>
						修改进度
					</vc-debounce-click>
					<vc-debounce-click
						v-if="$auth[1419]"
						:tag="Button"
						class="g-m-l-10"
						@click="handleMultiDel"
					>
						批量删除
					</vc-debounce-click>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { debounce } from 'lodash';
import { Confirm } from '@components/_common/confirm/confirm';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { createCheckAll } from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import item from './item';
import { ProjectPlanProgressUpdate } from './popup/progress-update';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"i-checkbox": Checkbox
	},
	mixins: [
		item,
		createCheckAll({ key: 'project_id' }),
		tableHeight({
			nav1: true,
			nav2: true,
		})
	],
	data() {
		const { query = {} } = this.$route;

		return {
			curLength: null,
			current: {},
			project_id: query.project_id || '',
			order: undefined,
			sort: undefined,
			tabs: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.techProjectPlanDemand.listInfo;
		},
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.loadTabsData();
	},
	methods: {
		/**
		 * 动态获取tab数据
		 */
		loadTabsData() {
			this.$request({
				url: 'TECH_PROJECT_PLAN_OVERVIEW_LIST_GET',
				type: 'GET',
				loading: false,
				param: { 
					is_page: 0
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data.list) && res.data.list.length) {
					if (!this.project_id) {
						this.project_id = res.data.list[0].project_id + '';
					}
					this.tabs = res.data.list;
					this.$vc.emit("TECH_PROJECT_PLAN_DEMAND_PROJECT_LOAD", { tabs: res.data.list });
					this.$store.commit("_TECH_PROJECT_PLAN_DEMAND_TABS_GET_SUCCESS", { data: res.data.list });
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'TECH_PROJECT_PLAN_DEMAND_LIST_GET',
				type: 'GET',
				param: {
					...query,
					project_id: this.project_id,
					page,
					pageSize
				},
			}).then((res) => {
				if (Array.isArray(res.data.list) && res.data.list.length) {
					this.curLength = res.data.list.length;
				}
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(project_id) {
			this.isAll = false;
			this.project_id = project_id;
			this.selected = [];

			const index = this.tabs.findIndex(it => it.project_id == project_id);
			this.$refs.tableTarget[index].$refs.tableTarget.selectAll(false);

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				project_id,
				page: this.current[project_id]
			};
			this.$router.replace(getHashUrl('/tech/project/plan/demand', { ...query }));
			this.$vc.emit("TECH_PROJECT_PLAN_DEMAND_PROJECT_CHANGE", { project_id });
		},
		handleChangePageSize() {
			this.isAll = false;
			this.selected = [];

			const index = this.tabs.findIndex(it => it.project_id == this.project_id);
			this.$refs.tableTarget[index].$refs.tableTarget.selectAll(false);

			this.$store.commit('TECH_PROJECT_PLAN_DEMAND_LIST_INIT');
		},
		/**
		 * 全选
		 */
		handleIsAll(val) {
			const index = this.tabs.findIndex(it => it.project_id == this.project_id);
			this.$refs.tableTarget[index].$refs.tableTarget.selectAll(val);
		},
		/**
		 * 批量修改进度
		 */
		handleMultiProgress() {
			const need_ids = this.selected.map(_item => {
				return _item.need_id;
			});

			if (need_ids.length) {
				ProjectPlanProgressUpdate.popup({
					projectId: this.project_id,
					needIds: need_ids
				}).then(() => {
					this.$store.commit('TECH_PROJECT_PLAN_DEMAND_LIST_RESET', { project_id: this.project_id });
				}).catch(error => {
					error && console.error(error);
				});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
		/**
		 * 批量删除
		 */
		handleMultiDel() {
			const index = this.tabs.findIndex(it => it.project_id == this.project_id);

			const need_ids = this.selected.map(_item => {
				return _item.need_id;
			});

			if (need_ids.length) {
				Confirm.popup({
					title: '',
					msg: '是否确认删除？',
					showIcon: true
				}).then(() => {
					this.$request({
						url: '_TECH_PROJECT_NEED_DEL_POST',
						type: "POST",
						loading: false,
						param: {
							need_id: need_ids
						},
						autoTip: true
					}).then(() => {
						this.$store.commit('TECH_PROJECT_PLAN_DEMAND_LIST_RESET', { project_id: this.project_id });

						this.$nextTick(() => {
							if (!(this.curLength - need_ids.length)) {
								this.$refs.tableTarget[index].currentPage = +page - 1;
								this.$refs.tableTarget[index].handleChange(+page - 1);
							}
						});
					}).catch(error => {});
				}).catch((error) => {
					error && console.error(error);
				});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		}
	}
};

</script>

<style lang="scss">
.v-tech-project-plan-demand-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
