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
		class="g-m-t-20 v-content-product-set-customer-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
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
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentProductSetCustomer.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_PRODUCT_SET_CUSTOMER_LIST_GET',
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
			this.$store.commit('CONTENT_PRODUCT_SET_CUSTOMER_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
	.v-content-product-set-customer-list {
	    ._operation {
	        span {
	        cursor: pointer;
			}
			span:first-child {
				position: relative;
				padding-right: 10px;
			}
			span:last-child {
				padding-left: 10px;
			}
	        span:first-child::after {
				content: '';
				position: absolute;
				height: 12px;
				width: 1px;
				top: 3px;
				right: 0px;
				background-color: currentColor;
	        }
	    }
	}
</style>
