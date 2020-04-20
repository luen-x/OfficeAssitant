<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label"
			:name="item.value"
		>
			<vc-paging
				:columns="columns"
				:show="item.value == type"
				:type="item.value"
				:table-opts="{height: tableHeight,}"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-sale-customer-business-detail-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { setTimeout } from 'timers';
import { getLevel } from '../_common/util';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, tableHeight({ tab: false, extra: 80 })],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			dataList: {},
			tabConfig: [],
			tabs1: [
				{ label: '加微信客户', value: '1' },
				{ label: '维护客户', value: '2' },
				{ label: '维护出来客户', value: '3' },
				{ label: '约见客户', value: '4' },
				{ label: '绕前台', value: '5' }
			],
			tabs2: [
				{ label: '过客户', value: '1' },
				{ label: '过出来客户', value: '2' },
				{ label: '谈判客户', value: '3' },
				{ label: '跟进客户', value: '4' }

			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerBusinessDetail.listInfo;
		},
		can_edit() {
			return this.dataList.can_edit;
		},
		tabs() {
			let tab = [];
			if (this.tabConfig.length > 0) {
				this.tabConfig.map(ele => {
					tab.push({ label: ele.value, value: ele.key + '' });
					return;
				});
				if (this.$route.query.staff_identity == 2) {
					tab.push({ label: '成交客户', value: '10' });
				}
			}
			return tab;
		},
		level() {
			return this.getLevel;
		}
	},
	created() {

	},
	mounted() {
		this.loadTabConfig();
	},
	methods: {
		loadTabConfig() {
			const { query } = this.$route;
			this.$request({
				url: '_SALE_BUSINESS_DATA_GET_CONFIG_GET',
				type: "get",
				param: {
					staff_id: query.staff_id || '',
				}
			}).then(res => {
				this.tabConfig = res.data;
				this.$nextTick(() => {
					if (this.tabConfig.length > 0) {
						this.handleChange(this.tabConfig[0].key + '');
					}
				});
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_BUSINESS_DETAIL_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.dataList = res.data;
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/customer/business/detail', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_BUSINESS_DETAIL_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
