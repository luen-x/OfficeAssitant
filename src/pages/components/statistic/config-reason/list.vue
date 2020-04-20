<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight}"
		mode="table"
		class="g-m-t-20 v-statistic-config-reason-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging
	},
	mixins: [
		item,
		tableHeight({ expand: false, nav2: false, tab: false })
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticConfigReason.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'STATISTIC_CONFIG_REASON_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					is_delete: 0
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_CONFIG_REASON_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>