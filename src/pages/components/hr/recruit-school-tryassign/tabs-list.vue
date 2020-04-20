<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + listInfo.count[index]"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
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
				class="v-hr-recruit-school-tryassign-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
				@sort-change="handleSortChange"
			>
				<div v-if="type == 1" slot="extra" class="g-flex-ac">

					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll">
						全选
					</i-checkbox>

					<i-button
						type="default"
						class="g-m-l-10"
						@click="handleAssign">
						指派
					</i-button>

				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox, Tabs, TabPane } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import { assignPModal } from './popup/assign.vue';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		checkAll,
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 0 }),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待分配', value: '1' },
				{ label: '分配中', value: '2' },
				{ label: '已分配', value: '3' }
			],
			sort: {
				order_by_reply_time: null, // 回复报到时间排序
				order_by_ticket_arrive_time: null, // 到杭时间排序
				order_by_assign_time: null // 试岗分配时间排序
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSchoolTryassign.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/hr/recruit/school/tryassign');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			if (this.type !== type) {
				this.isAll = false;
				this.handleIsAll(false);
				this.type = type;
				this.sort = {
					order_by_reply_time: null,
					order_by_ticket_arrive_time: null, 
					order_by_assign_time: null
				};
				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query.order_by_reply_time ? delete query.order_by_reply_time : '';
				query.order_by_ticket_arrive_time ? delete query.order_by_ticket_arrive_time : '';
				query.order_by_assign_time ? delete query.order_by_assign_time : '';
				query = {
					...query,
					type,
					fixPosition: false,
					page: this.current[type]
				};
				this.$router.replace(getHashUrl('/hr/recruit/school/tryassign', { ...query }));
				this.$nextTick(() => {
					this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
				});
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget[+this.type - 1].$refs.tableTarget.selectAll(val);
		},
		// 指派
		handleAssign() {
			if (this.selected.length) {
				assignPModal.popup({
					name: 'assign',
					selected: this.selected,
					type: this.type + ''
				}).then(res => {
					this.isAll = false;
				}).catch(() => {});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
		handleSortChange({ key, order }) {
			this.sort = {
				order_by_reply_time: null,
				order_by_ticket_arrive_time: null, 
				order_by_assign_time: null
			};
			
			this.sort[`order_by_${key}`] = order === 'asc' ? 1 : (order === 'desc' ? 0 : null);
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/tryassign',
				{
					...this.$route.query,
					...this.sort
				}
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
