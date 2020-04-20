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
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-content-activity-list-list"
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
			nav2: false,
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '全部', value: '0' },
				{ label: '待报名', value: '1' }, 
				{ label: '报名中', value: '2' },
				{ label: '报名结束', value: '3' },
				{ label: '进行中', value: '4' },
				{ label: '已结束', value: '5' }
			],
			activityCategory: [],
			tabsNum: [0, 0, 0, 0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentActivityList.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_ACTIVITY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then(({ data }) => {
				this.tabsNum = [data.all_count, data.wait_apply_count, data.applying_count,
					data.apply_end_count, data.in_process_count, data.end_count];
				this.resetType('0', this.tabsNum, '/content/activity/list');
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
			this.$router.replace(getHashUrl('/content/activity/list', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_ACTIVITY_LIST_INIT');
		},
		handleRowClick(rowData) {
			if (!this.$auth['70']) return;
			DetailDrawer.popup({
				detailData: rowData
			}).then(res => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[this.type].$refs.tableTarget.clearCurrentRow();
			});
		}
	}
};

</script>

<style lang="scss">

</style>
