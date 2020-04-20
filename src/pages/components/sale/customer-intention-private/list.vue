<template>
	<div style="position:relative;">
		<oa-loading v-if="uploadStatus.status">
			<span class="g-m-t-5" >
				{{ loadingPrefix }} {{ uploadStatus.process }}
			</span>
		</oa-loading>
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight, highlightRow: true}"
			mode="table"
			class="g-m-t-20 v-sale-customer-intention-private-list"
			@page-size-change="handleChangePageSize"
			@row-click="handleOpenDrawer"
		/>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
import Loading from '@components/_common/loading/loading';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'oa-loading': Loading
	},
	
	mixins: [
		item, 
		tableHeight({
			filter: true,
			footer: true
		})
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerIntentionPrivate.listInfo;
		},
		uploadStatus() {
			return this.$store.state.saleCustomerIntentionPrivate.uploadStatus;
		},
		loadingPrefix() {
			return { 1: '导入中', 2: '查询中', 3: '数据刷新中' }[this.uploadStatus.deal_type] || '';
			
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_INTENTION_PRIVATE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_INTENTION_PRIVATE_LIST_INIT');
		},
		
	}
};

</script>

<style lang="scss">

</style>
