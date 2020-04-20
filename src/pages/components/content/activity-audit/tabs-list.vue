<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		class="g-tabs-card"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item, i) in tabs"
			:key="item.value"
			:label="item.label + tabsNum[i]" 
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true }"
				class="v-content-activity-audit-list"
				mode="table"
				@row-click="handleRowClick"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import { DetailDrawer } from './popup/detail';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({
			nav2: false
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabsNum: [0, 0, 0, 0, 0],
			tabs: [
				{ label: '全部', value: '0' }, 
				{ label: '待审核', value: '1' }, 
				{ label: '已拒绝', value: '3' },
				{ label: '已通过', value: '2' },
				{ label: '缺席客户', value: '4' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentActivityAudit.listInfo;
		}
	},
	created() {
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_ACTIVITY_AUDIT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					activity_type: this.$route.query.activity_type || 1,
					page,
					pageSize
				},
			}).then((res) => {
				const data = res.data;
				this.tabsNum = [data.all_count, data.check_count, data.refuse_count, data.pass_count, data.absent_count];
				this.resetType('0', this.tabsNum, '/content/activity/audit');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/content/activity/audit', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_ACTIVITY_AUDIT_LIST_INIT');
		},
		handleRowClick(rowData) {
			DetailDrawer.popup({
				detailData: rowData
			}).then(err => {
				this.$refs.tableTarget[this.type].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[this.type].$refs.tableTarget.clearCurrentRow();
			});
		}
	}
};
</script>

<style lang="scss">
</style>