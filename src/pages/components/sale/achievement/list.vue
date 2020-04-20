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
		class="g-m-t-20 v-sale-achievement-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
import { getLevel } from '@components/sale/_common/util';

import moment from 'moment';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			footer: true,
		})
	],
	data() {
		const { query } = this.$route;
		return {
			month: moment().format('YYYY-MM')
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleAchievement.listInfo;
		},
		level() {
			return getLevel();
		}
	},
	created() {
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_ACHIEVEMENT_LIST_GET',
				type: 'GET',
				param: {
					month: this.month,
					...query,
					depart_id: query.depart_id || [this.$global.staff.depart_id],
					page,
					pageSize,
				},
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_ACHIEVEMENT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
