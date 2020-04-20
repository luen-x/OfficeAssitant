<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label" 
			:name="item.value"
		>
			<oa-filter :ref="'filter'+item.value" v-model="item.query" :type="item.value" @search="handleSearch"/>
			<vc-paging
				:columns="columns[item.value]"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="false"
				:load-data="loadData"
				:table-opts="{height: tableHeight,highlightRow: true}"

				class="v-statistic-business-customer-rebuy-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@sort-change="handleSortChange($event,'filter'+item.value)"

			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl, getFormatNum } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';

// item
import item from './item';
import Filter from './filter';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-filter': Filter
	},
	mixins: [item, tableHeight({ expand: false, nav2: false, extra: 60 })],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '战区排名', value: '1', query: {} }, 
				{ label: '部门排名', value: '2', query: {} }, 
				{ label: '员工排名', value: '3', query: {} }
			],
			typeUrl: {
				1: 'STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST_GET',
				2: 'STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST2_GET',
				3: 'STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST3_GET',
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticBusinessCustomerRebuy.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			const query = this.$refs['filter' + this.type][0].query;
			const _query = { year: query.year, sort_field: query.sort_field, sort_order: query.sort_order };
			if (this.type == 1) {
				_query.zone_depart_id = query.zone_depart_id;
			} else if (this.type == 2) {
				_query.depart_id = query.depart_ids[query.depart_ids.length - 1] || '';
			} else if (this.type == 3) {
				_query.staff_id = query.staff_id;
			}	
			return this.request({
				url: this.typeUrl[this.type],
				redirect: "STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST_GET_SUCCESS",
				type: 'GET',
				param: {
					..._query,
					type: this.type,
					page,
					pageSize
				},
				initList: (list) => {
					list.forEach(it => {
						it.rebuy_amount_total = getFormatNum(it.rebuy_amount_total);
					});
					// list = [...list, ...list];
					// list = [...list, ...list];
					// list = [...list, ...list];
					// list = [...list, ...list];
					// list = [...list, ...list];
					return list;
				}
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
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
			this.$router.replace(getHashUrl('/statistic/business/customer/rebuy', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST_INIT');
		},
		handleSearch() {
			
		},
		handleSortChange({ key, order }, filter) {
			console.log(key, order, filter);
			const _query = this.$refs[filter][0].query;
			if (order == 'normal') {
				delete _query.sort_field;
				delete _query.sort_order;
			} else {
				// if (keyMap && keyMap[key]) {
				// 	_query.sort_field = keyMap[key];
				// } else {
				// 	_query.sort_field = key;
				// }
				_query.sort_field = key;
				_query.sort_order = order;
			}
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST_INIT', { type: this.type });
		}
		// handleSortChange({ key, order }) {
		// 	const orderQuery = {
		// 		customer_repeat_num: '',
		// 		repeat_amount_total: "",
		// 	};
		// 	orderQuery[key] = order == 'normal' ? '' : order;
		// 	const query = { ...this.$route.query };

		// 	this.$router.replace({
		// 		path: '/statistic/business/customer/rebuy',
		// 		query: {
		// 			...this.$route.query,
		// 			...orderQuery
		// 		}
		// 	});
		// 	this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST_INIT', { type: this.type });
		// }
	}
};

</script>

<style lang="scss">

</style>
