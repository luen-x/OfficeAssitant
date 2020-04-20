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
		class="g-m-t-20 v-finance-services-commission-list"
		@row-click="handleShowDetail"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import moment from 'moment';
import { Paging } from 'wya-vc';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [
		item,
		autoFix(),
		tableHeight({ })
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.financeServicesCommission.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'FINANCE_SERVICES_COMMISSION_LIST_GET',
				type: 'GET',
				param: {
					service_amount_type: +query.service_amount_type || 1,
					...query,
					month: moment(query.month).format('YYYY-MM') || moment().format('YYYY-MM'),
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('FINANCE_SERVICES_COMMISSION_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
