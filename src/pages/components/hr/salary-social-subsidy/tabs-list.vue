<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.value"
			:label="`${item.label}`"
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
				class="v-hr-salary-social-subsidy-list"
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
						<span style="margin-left: 10px;">全选</span>
					</i-checkbox>
					<i-button
						v-if="$auth['1131']"
						@click="handleResizeAll"
					>批量转换</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import checkAll from '@extends/mixins/checkAll';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { BatchesModal } from './popup/modal';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"i-checkbox": Checkbox,
		"i-button": Button,

	},
	mixins: [
		item,
		checkAll,
		tableHeight({ nav1: true, nav2: true, tab: true })
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			isAll: false,
			tableLenght: '',
			currentid: 0,
			count: [0, 0],
			tabs: [
				{ label: '社保缴纳', value: '1' },
				{ label: '发放补贴', value: '2' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrSalarySocialSubsidy.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_SALARY_SOCIAL_SUBSIDY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [+res.data.social_security_count, +res.data.subsidy_count];
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/salary/social/subsidy', { ...query }));
			this.$store.commit('HR_SALARY_SOCIAL_SUBSIDY_LIST_INIT');
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_SALARY_SOCIAL_SUBSIDY_LIST_INIT');
		},

		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleResizeAll() {
			if (this.selected.length === 0) {
				this.$Message.warning('请至少选择一位员工！');
				return false;
			}
			let staffArr = this.selected.map((i, index) => {
				return i.staff_id;
			});
			BatchesModal.popup({
				staffArr,
				type: this.type
			}).then(res => {
				this.$Message.success('操作成功');
				this.isAll = false;
				this.$store.commit('HR_SALARY_SOCIAL_SUBSIDY_LIST_INIT');
			}).catch(() => {});
		},
		tableSelectAll(res) {
			this.isSelect = true;
			this.tableLenght = res.length;
		},
	}
};

</script>

<style lang="scss">

</style>
