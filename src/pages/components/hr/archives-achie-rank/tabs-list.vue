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
				:columns="getColumns(item.value)"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-hr-archives-achie-rank-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@sort-change="handleSortChange"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			sort: String(query.sort || ""), 
			tabs: [
				{ label: '员工业绩', value: '1' }, 
				{ label: '部门业绩', value: '2' }, 
				{ label: '战区业绩', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrArchivesAchieRank.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ARCHIVES_ACHIE_RANK_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				// ...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/archives/achie/rank', { ...query }));
			this.$store.commit('HR_ARCHIVES_ACHIE_RANK_LIST_INIT');
		},
		handleChangePageSize() {
			this.$store.commit('HR_ARCHIVES_ACHIE_RANK_LIST_INIT');
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/archives/achie/rank', 
				{ 
					...this.$route.query, 
					sort: this.sort
				}
			));
			this.$store.commit('HR_ARCHIVES_ACHIE_RANK_LIST_INIT');
		},
		handleSortChange(obj) {
			this.sort = '';
			let status = '';
			let { query = {} } = getParseUrl();
			if (obj.order === "asc") {
				status = '_desc';
			} else {
				status = "_asc";
			}
			this.sort = obj.key + status;
			this.handleSearch();
		},
	}
};

</script>

<style lang="scss">

</style>
