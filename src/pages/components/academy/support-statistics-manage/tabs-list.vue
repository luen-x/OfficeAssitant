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
			:label="item.label"
			:name="item.value"
		>
			<vc-paging
				:columns="columns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-academy-support-statistics-manage-list"
				mode="table"
				@sort-change="handleSortChange"
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
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, tableHeight()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '全部', value: '0' },
				{ label: '工具包', value: '4' },
				{ label: '自习室', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academySupportStatisticsManage.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'ACADEMY_SUPPORT_STATISTICS_MANAGE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/academy/support/statistics/manage', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_SUPPORT_STATISTICS_MANAGE_LIST_INIT');
		},
		handleSortChange({ order }) {
			let ord = {
				desc: 3,
				asc: 4,
			};
			this.$router.replace(getHashUrl(
				'/academy/support/statistics/manage',
				{
					...this.$route.query,
					total_count_sort: ord[order],
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_STATISTICS_MANAGE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>

