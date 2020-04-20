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
			<oa-explain
				v-if="item.explain"
				:title="item.label"
				:content="item.content"
				type="collapse"
			/>
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
				class="v-hr-recruit-social-talent-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div slot="extra" class="g-flex-ac">
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<!-- 删除恢复 -->
					<!-- <div v-if="$auth[186]" class="g-gray-btn-line g-m-r-10" @click="handleRecover">
						恢复
					</div> -->
					<div v-if="$auth[1536]" class="g-gray-btn-line" @click="handleBatchDel">
						删除
					</div>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
// item
import Explain from '@components/_common/explain/explain';
import item from './item';
import { OptionTipModal } from './popup/option';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
		'oa-explain': Explain
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
			explainTabs: ['5', '6'],
			tabKey: 'type'
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: query.type || "0", // 同tabs下的value
			current: {},
			tabs: [
				{ label: '全部', value: '0' },
				{ label: '未面试淘汰', value: '1' },
				{ label: '卷pass', value: '6' },
				{ label: '面试淘汰', value: '2' },
				{ label: '未接受offer', value: '3' },
				{
					label: '试岗淘汰',
					value: '4',
					explain: true,
					content: '员工在试岗中被淘汰，该淘汰包括试岗不过关被淘汰以及试岗过程中主动离开，这两种情况均视为试岗淘汰'
				},
				{
					label: '试岗完成淘汰',
					value: '5',
					explain: true,
					content: '试岗完成并且通过后，主动放弃入职机会离开的人，视为试岗完成淘汰'
				}
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSocialTalent.listInfo;
		},
		//
	},
	created() {

		// store中存type
		this.$store.commit('HR_RECRUIT_SOCIAL_TALENT_SELECTED_TAB', this.type);

	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SOCIAL_TALENT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('0', this.listInfo.count, '/hr/recruit/talent/obsolete');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			if (this.type !== type) {
				this.isAll = false;
				this.handleIsAll(false);
				this.type = type;
				this.loadTableTitle();

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					type,
					fixPosition: false,
					page: this.current[type]
				};
				this.$router.replace(getHashUrl('/hr/recruit/talent/obsolete', { ...query }));
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_RECRUIT_SOCIAL_TALENT_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs['talbe' + this.type][0].$refs.tableTarget.selectAll(val);
		},
		// handleRecover(ids) {
		// 	let applicantIds = this.selected.map((item) => item.applicant_id); // eslint-disable-line
		// 	if (ids instanceof Array) {
		// 		applicantIds = ids;
		// 	}
		// 	if (applicantIds.length <= 0) {
		// 		this.$Message.warning('请至少选择一项进行操作！');
		// 		return;
		// 	}

		// 	OptionTipModal.popup({
		// 		type: 'recover',
		// 		applicantIds
		// 	}).then((res) => {
		// 		this.$Message.success('操作成功');
		// 		this.isAll = false;
		// 	}).catch((res) => {

		// 	});
		// },
		handleBatchDel() {
			let applicantIds = this.selected.map((item) => item.applicant_id); // eslint-disable-line

			if (applicantIds.length <= 0) {
				this.$Message.warning('请至少选择一项进行操作！');
				return;
			}

			OptionTipModal.popup({
				type: 'del',
				applicantIds
			}).then((res) => {
				this.$Message.success('删除成功');
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
					scenario: 4
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_RECRUIT_SOCIAL_TALENT_TITLE_CHANGE', { ...res.data, type: type || '0' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		}
	}
};

</script>

<style lang="scss">

</style>
