<template>
	<i-tabs 
		:value="rate_id" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item) in tabs"
			:key="item.rate_id"
			:label="item.rate_name" 
			:name="item.rate_id + ''"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns"
				:show="item.rate_id == rate_id" 
				:type="item.rate_id"
				:data-source="listInfo[item.rate_id].data"
				:total="listInfo[item.rate_id].total"
				:reset="listInfo[item.rate_id].reset"
				:current.sync="current[item.rate_id]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: false}"
				class="v-tech-share-progress-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
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
	mixins: [
		item,
		tableHeight({
			nav1: true,
			nav2: true,
		})
	],
	data() {
		const { query } = this.$route;
		return {
			tabs: [],
			current: {},
			order: undefined,
			sort: undefined,
			rate_id: query.rate_id,
			project_id: query.project_id
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.techShareProgress.listInfo;
		}
	},
	mounted() {
		const { query } = this.$route;
		this.project_id && this.loadTabsData();
		this.$vc.on('TECH_SHARE_PROGRESS_PROJECT_CHANGE', ({ project_id }) => {
			this.project_id = project_id;
			this.loadTabsData();
		});
	},
	beforeDestroy() {
		this.$vc.off("TECH_SHARE_PROGRESS_PROJECT_CHANGE");
	},
	methods: {
		/**
		 * 动态获取tab数据
		 */
		loadTabsData() {
			this.tabs = [];
			this.rate_id = '';
			this.$store.commit('_TECH_SHARE_PROGRESS_TABS_GET_SUCCESS', []);
			this.$request({
				url: '_TECH_PROJECT_NEED_RATE_TAB_LIST_GET',
				type: 'GET',
				loading: false,
				param: { 
					project_id: this.project_id
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data) && res.data.length) {
					this.tabs = res.data;
					this.rate_id = res.data[0].rate_id + '';
					this.$store.commit('_TECH_SHARE_PROGRESS_TABS_GET_SUCCESS', res.data);
					let { query = {} } = getParseUrl();
					this.$router.replace(getHashUrl('/tech/share/progress', { ...query, rate_id: this.rate_id }));
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'TECH_SHARE_PROGRESS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					rate_id: this.rate_id,
					page,
					pageSize
				},
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(rate_id) {
			this.rate_id = rate_id;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				rate_id,
				page: this.current[rate_id]
			};
			this.$router.replace(getHashUrl('/tech/share/progress', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('TECH_SHARE_PROGRESS_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-tech-share-progress-list {
	&.vc-paging .__footer {
		width: 100%!important;
	}
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
