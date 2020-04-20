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
		class="g-m-t-20 v-statistic-business-sale-rank-depart-list"
		@page-size-change="handleChangePageSize"
		@sort-change="handleSortChange"
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
		'vc-paging': Paging
	},
	mixins: [
		item,
		tableHeight({ expand: false, nav2: false, tab: false, extra: 44, extraClass: ['_goal'] })
	],
	data() {
		const { query } = this.$route;

		return {
			sort: "",
			formatConfig: [
				'pay_performance', 
				'real_performance', 
				'average_performance',
				{ key: 'min_target', precision: 2, prefix: "", suffix: '万' },
				{ key: 'target', precision: 2, prefix: "", suffix: '万' },
				{ key: 'max_target', precision: 2, prefix: "", suffix: '万' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticBusinessSaleRankDepart.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let params = this.$parent.$children[1];

			return this.request({
				url: 'STATISTIC_BUSINESS_SALE_RANK_DEPART_LIST_GET',
				type: 'GET',
				param: {
					...query,
					...params.search,
					...params.time,
					year: +params.search.time_type === 2 ? params.time.year : '',
					config_id: +params.search.time_type === 3 ? params.time.season[1] : '',
					month: +params.search.time_type === 4 ? moment(params.time.month).format('YYYY-MM') : '',
					season: '',
					depart_type: 3,
					depart_name: '',
					sort: this.sort,
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
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_DEPART_LIST_INIT');
		},
		handleSortChange({ key, order }) {
			let obj = {
				'pay_performance_desc': 1,
				'pay_performance_asc': 2,
				'real_performance_desc': 3,
				'real_performance_asc': 4
			};

			this.sort = obj[`${key}_${order}`];
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_DEPART_LIST_INIT');
		},
	}
};
</script>

<style lang="scss">
</style>