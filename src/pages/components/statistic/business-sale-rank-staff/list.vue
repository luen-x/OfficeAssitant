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
		class="g-m-t-20 v-statistic-business-sale-rank-staff-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl, formatNumBatch } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import moment from 'moment';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [
		item,
		tableHeight({ expand: false, nav2: false, tab: false, extra: 44, extraClass: ['_goal'] })
	],
	data() {
		const { query } = this.$route;

		return {
			formatConfig: [
				'pay_performance', 
				'real_performance'
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticBusinessSaleRankStaff.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let params = this.$parent.$children[1];
			
			return this.request({
				url: 'STATISTIC_BUSINESS_SALE_RANK_STAFF_LIST_GET',
				type: 'GET',
				param: {
					...query,
					...params.search,
					...params.time,
					year: +params.search.time_type === 2 ? params.time.year : '',
					config_id: +params.search.time_type === 3 ? params.time.season[1] : '',
					month: +params.search.time_type === 4 ? moment(params.time.month).format('YYYY-MM') : '',
					season: '',
					staff_name: '',
					whose: '',
					page,
					pageSize
				},
				initList: (list) => {
					return formatNumBatch(list, this.formatConfig);
				}
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_STAFF_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>