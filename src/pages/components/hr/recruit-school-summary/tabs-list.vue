<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		class="v-hr-recruit-school-summary"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + listInfo.count[index]"
			:name="item.value"
		>
			<oa-explain
				v-if="item.explain"
				:title="item.label"
				:content="item.content"
				type="collapse"
			/>
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
				class="v-hr-recruit-school-summary-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
				@sort-change="handleSortChange"
			>
				<div slot="extra" class="g-flex-ac">

					<i-checkbox
						v-if="(
							$auth[148] && type === '5') 
							|| ($auth[151] && (type === '10' || type === '11'))
						|| (type == 1 || type == 2)"
						v-model="isAll"
						@on-change="handleIsAll">
						全选
					</i-checkbox>

					<i-button
						v-if="$auth[148] && type === '5'"
						type="default"
						class="g-m-l-10"
						@click="handleAssign">
						指派
					</i-button>

					<i-button
						v-if="$auth[151] && (type === '10' || type === '11')"
						type="default"
						class="g-m-l-10"
						@click="handleRecover">
						恢复
					</i-button>

					<i-button
						v-if="(type == 1 || type == 2)"
						type="default"
						class="g-m-l-10"
						@click="handleSelectInterview">
						统一面试
					</i-button>

					<i-button
						v-if="(type == 1 || type == 2)"
						type="default"
						class="g-m-l-10"
						@click="handleBatchChange">
						批量变更
					</i-button>

				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Copy, Upload, Paging } from 'wya-vc';
import { Button, Checkbox, Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem, Poptip, Tooltip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
// import { autoFix } from '@extends/mixins/auto-fix';
import Explain from '@components/_common/explain/explain';
import moment from 'moment';
import { delPModal } from './popup/delete.vue';
import { assignPModal } from './popup/assign.vue';
import { recoverPModal } from './popup/recover.vue';
import { InterviewDrawer } from './popup/interview';
import { BatchChangeModal } from './popup/batch-change';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-explain': Explain
	},
	mixins: [
		item,
		checkAll,
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 0, extraClass: ['c-explain-collapse'] })
		// autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [],
			sortKeyArr: [
				{
					key: 'send_offer_time',
					order: ''
				},
				{
					key: 'reply_time',
					order: ''
				},
				{
					key: 'try_time',
					order: ''
				},
				{
					key: 'register_time',
					order: ''
				},
				{
					key: 'predict_entry_time',
					order: ''
				},
				{
					key: 'entry_time',
					order: ''
				},
				{
					key: 'pass_time',
					order: ''
				},
				{
					key: 'departure_time',
					order: ''
				},
				{
					key: 'leave_time',
					order: ''
				}
			],
			splitDay: moment().format('YYYY') + '-08-31'
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSchoolSummary.listInfo;
		}
	},
	created() {
		this.tabs = [
			{
				label: '全部', value: '0'
			},
			{
				label: '待沟通',
				value: '1',
				explain: true,
				content: '经过初步的筛选后，对部分人群进行邀约面试。这部分人群即为待沟通'
			},
			{
				label: '初步沟通',
				value: '2',
				explain: true,
				content: '联系过并简单介绍而未进行正式面试，需要进一步沟通跟进的人员'
			},
			{
				label: '待定中',
				value: '3',
				explain: true,
				content: '面试后还没确定是否录取，在考虑中，这样的人群即为待定中'
			},
			{
				label: '发offer', value: '4'
			},
			{
				label: '已回复', value: '5'
			},
			{
				label: '已报到', value: '6'
			},
			{
				label: '试岗', value: '7'
			},
			{
				label: '待入职', value: '8'
			},
			{
				label: '已入职', value: '9'
			},
			{
				label: '已淘汰',
				value: '10',
				explain: true,
				content: '待沟通到已回复状态下淘汰会进入到已淘汰（包括主动和被动），“被动”是因为我方已录取而对方拒绝的情况，“主动”是我方直接淘汰'
			},
			{
				label: '已离开',
				value: '11',
				explain: true,
				content: '来公司报到但并没有正式入职的人员，在这个阶段下淘汰则进入已离开'
			},
			{
				label: '已离职', value: '12'
			}

		];

		// store中存tab
		this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_SELECTED_TAB', this.type);
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SCHOOL_SUMMARY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					
				},
				initList: (list) => {
					list.forEach(it => {
						it.content == '-' && (it.content = '');
					});
					return list;
				},
				loading: false
			}).then((res) => {
				// this.resetType('0', this.listInfo.count, '/hr/recruit/school/summary');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			if (this.type !== type) {
				this.isAll = false;
				this.handleIsAll(false);
				this.type = type;
				this.$nextTick(() => {
					this.$refs.tableTarget[+type].$refs.tableTarget.handleResize();
				});
				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					type,
					is_my_interview: type == 2 ? 0 : '',
					fixPosition: false,
					page: this.current[type]
				};
				this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_LIST_INIT');
				this.$router.replace(getHashUrl('/hr/recruit/school/summary', { ...query }));
				
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type].$refs.tableTarget.selectAll(val);
		},
		// 排序方式变化
		handleSortChange(obj) {
			let { query = {} } = getParseUrl();
			let arr = [...this.sortKeyArr];
			arr.forEach((item1, index) => (item1.key === obj.key ? arr[index].order = obj.order : arr[index].order = ''));
			arr.forEach(item2 => (
				item2.order ? (query[`order_by_${item2.key}`] = item2.order === 'asc' ? 0 : 1) : query[`order_by_${item2.key}`] = ''));

			this.$router.replace(getHashUrl('/hr/recruit/school/summary', { ...query }));
			this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_LIST_INIT');
		},
		// 指派
		handleAssign() {
			if (this.selected.length) {
				assignPModal.popup({
					data: {
						selected: this.selected,
					}
				}).then(res => {
					this.$Message.success('操作成功');
					this.isAll = false;
				}).catch(() => {});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
		// 恢复
		handleRecover() {
			if (this.selected.length) {
				recoverPModal.popup({
					data: {
						type: this.type,
						selected: this.selected,	// 选中元素
					}
				}).then(res => {
					this.$Message.success('操作成功');
					this.isAll = false;
				}).catch(() => {});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: type || '0',
					scenario: 2
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_TITLE_CHANGE', { ...res.data, type: type || '0' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleSelectInterview() {
			if (this.selected.length) {
				InterviewDrawer.popup({
					selected: this.selected
				}).then(() => {
					this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_LIST_INIT', { type: this.type || '0' });
				});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
		handleBatchChange() {
			if (this.selected.length) {
				BatchChangeModal.popup({
					selected: this.selected
				}).then(() => {
					this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_LIST_INIT', { type: this.type || '0' });
				});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		}
	}
};

</script>
