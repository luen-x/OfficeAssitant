<template>
	<vc-paging
		ref="tableTarget"
		:columns="columnsShow"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:table-opts="{height: tableHeight,}"
		:history="true"
		:staff="counts.staff_identity"
		:load-data="loadData"
		mode="table"
		class="g-m-t-20 v-sale-customer-business-check-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item, tableHeight({ tab: false, extra: 80 })],
	data() {
		const { query } = this.$route;
		return {
			counts: '',

		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerBusinessCheck.listInfo;
		},
		columnsShow() {
			let columnsShow = this.$store.state.saleCustomerBusinessCheck.title[this.$route.query.type || '1'].title_show.map(cloShow => {
				const result = this.columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key：" + cloShow.key);
				return result;
			}).filter(Boolean);
			columnsShow.push(
				{
					title: '操作',
					key: 'link',
					minWidth: 120,
					fixed: 'right',
					render: (h, params) => {
						return (
							<div onClick={() => { this.handleCheck(params.row.which_day); }} class="g-operation">查看</div>
						);
					}
				}
			);
			return columnsShow;
		}
	},
	created() {
		this.loadTableTitle();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_BUSINESS_CHECK_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				this.counts = res.data;
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_BUSINESS_CHECK_LIST_INIT');
		},
		loadTableTitle() {
			this.$request({
				url: "_SALE_BUSINESS_DATA_INFO_TABLE_CONFIG_GET",
				type: "GET",
				param: {
					staff_id: this.$route.query.staff_id || '',
					table_type: this.$route.query.staff_identity == 2 ? 1 : this.level == 4 ? 2 : 1
				},
				loading: false,
			}).then(res => {
				this.$store.commit('SALE_CUSTOMER_BUSINESS_CHECK_TITLE_CHANGE', { ...res.data, type: this.type || '1' });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
	}
};

</script>

<style lang="scss">

</style>
