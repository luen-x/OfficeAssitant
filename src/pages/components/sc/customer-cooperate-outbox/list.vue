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
		class="g-m-t-20 v-sc-customer-cooperate-outbox-list"
		@page-size-change="handleChangePageSize"
		@page-change="handlePageChange"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import { log } from 'util';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
			curPage: 1
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.scCustomerCooperateOutbox.listInfo;
		},

		tableHeight() {
			let len = 0;
			let listInfoData = this.$store.state.scCustomerCooperateOutbox.listInfo.data[this.curPage];

			for (let i in listInfoData) {
				listInfoData[i] && len++;
			}

			let winHeight;

			if (len > 15) {
				// 获取窗口高度
				if (window.innerHeight) {
					winHeight = window.innerHeight - 300;
				} else if (document.body && document.body.clientHeight) {
					winHeight = document.body.clientHeight - 300;
				}

				return winHeight;
			}
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'SC_CUSTOMER_COOPERATE_OUTBOX_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					type: 1
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handlePageChange(page) {
			this.curPage = page;
			
		},
		handleChangePageSize() {
			this.$store.commit('SC_CUSTOMER_COOPERATE_OUTBOX_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>