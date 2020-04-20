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
			:label="`${item.label} ${listInfo.count[index]}`"
			:name="item.value"
		>
			<vc-paging
				:ref="'talbe' + item.value"
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
				class="v-hr-recruit-social-summary-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
				@sort-change="handleSortChange"
			>
				<div v-if="type != 0" slot="extra" class="g-flex-ac">
					<i-checkbox
						v-if="(type == 1 && $auth[174]) || ($auth[175] && type !== '7')"
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<div
						v-if="type == 1 && $auth[174]"
						class="g-gray-btn-line g-m-r-10"
						@click="handleBatchDel">
						删除
					</div>
					<div v-if="$auth[175] && type !== '7'" class="g-gray-btn-line g-m-r-10" @click="handleAllocate">
						分配
					</div>
					<div v-if="type !== '6'&&type !== '7'" class="g-gray-btn-line g-m-r-10" @click="handleAllPass">
						淘汰
					</div>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Button, Checkbox, Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem, Poptip, Tooltip } from 'iview';
import { Paging, Copy } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
// item
import item from './item';
import { DelTipModal } from './popup/del-tip';
import { AllocateModal } from './popup/allocate';
import { PassModal } from './popup/pass';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox
	},
	mixins: [
		item,
		checkAll,
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 0 }),
		autoFix()
	],
	// mixins: [item, checkAll],
	data() {
		const { query } = this.$route;
		return {
			current: {},
			type: query.type || "0", // 同tabs下的value
			tabs: [
				{ label: '全部', value: '0' },
				{ label: '待沟通', value: '1' },
				{ label: '安排面试', value: '8' },
				{ label: '实际面试', value: '2' },
				{ label: '发offer', value: '3' },
				{ label: '试岗', value: '4' },
				{ label: '待入职', value: '5' },
				{ label: '已入职', value: '6' },
				{ label: '已离职', value: '7' }
			],
			sortKeyArr: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSocialSummary.listInfo;
		}
	},
	created() {
		// store中存type
		this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_SELECTED_TAB', this.type);
		// this.listLoadData();
	},
	methods: {
		loadData(page, pageSize) {
			// this.isAll = false;
			// this.selected = [];
			// let { query = {} } = getParseUrl();
			// let params = {
			// 	...query,
			// 	all_invite: query.all_invite ? query.all_invite : (this.$auth[173] ? 1 : 0),
			// 	type: this.type,
			// 	page,
			// 	pageSize
			// };
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			let params = {
				...query,
				type: this.type,
				page,
				pageSize,
			};
			if (this.$auth[173] && !query.all_invite) {
				params.all_invite = 1;
			}
			return this.request({
				url: 'HR_RECRUIT_SOCIAL_SUMMARY_LIST_GET',
				type: 'GET',
				param: params,
				initList: (list) => {
					list.forEach(it => {
						if (it.content == '-') {
							it.content = '';
						}
					});

					return list;
				}
			}).then((res) => {
				this.resetType('0', this.listInfo.count, '/hr/recruit/social/summary');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			if (this.type !== type) {
				this.isAll = false;
				this.handleIsAll(false);
				this.type = type;

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					type,
					fixPosition: false,
					page: this.current[type]
				};
				this.$router.replace(getHashUrl('/hr/recruit/social/summary', { ...query }));
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT');
		},
		// 排序方式变化
		handleSortChange(obj) {
			let { query = {} } = getParseUrl();
			query[`order_by_${obj.key}`] = obj.order === 'asc' ? 0 : 1;

			this.$router.replace(getHashUrl('/hr/recruit/social/summary', { ...query }));
			this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs['talbe' + this.type][0].$refs.tableTarget.selectAll(val);
		},
		handleAllocate() {
			let applicantIds = this.selected.map((item) => item.applicant_id); // eslint-disable-line
			if (applicantIds.length === 0) {
				this.$Message.warning('请至少选择一项进行操作！');
				return;
			}
			AllocateModal.popup({
				applicantIds
			}).then((res) => {
				this.isAll = false;
				this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT');
			}).catch((res) => {

			});
		},
		handleAllPass() {
			let applicantIds = this.selected.map((item) => item.applicant_id); // eslint-disable-line
			if (applicantIds.length === 0) {
				this.$Message.warning('请至少选择一项进行操作！');
				return;
			}
			PassModal.popup({
				info: {
					applicant_id: applicantIds,
					status: this.selected[0].status
				}
			}).then((res) => {
				this.isAll = false;
				this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT');
			}).catch((res) => {

			});
		},
		handleBatchDel() {
			let applicantIds = this.selected.map((item) => item.applicant_id); // eslint-disable-line
			if (applicantIds.length === 0) {
				this.$Message.warning('请至少选择一项进行操作！');
				return;
			}
			DelTipModal.popup({
				type: 'del',
				applicantIds
			}).then((res) => {
				this.isAll = false;
			}).catch((res) => {

			});
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: type || '0',
					scenario: 3
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_TITLE_CHANGE', { ...res.data, type: type || '0' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		listLoadData() {
			return this.$request({
				url: "_HR_RECRUIT_SCHOOL_EDIT_CUSTOMER_LABEL_SETTING_GET",
				type: "GET",
				param: {
					scenario: 1,
					label: "sort"
				},
				loading: false
			}).then(res => {
				this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_SORT', res.data);
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
	}
};

</script>

<style lang="scss">

</style>
