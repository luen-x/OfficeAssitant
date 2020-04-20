<template>
	<i-tabs 
		:value="ic_system_id" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item) in tabs"
			:key="item.ic_system_id"
			:label="item.system_name" 
			:name="item.ic_system_id + ''"
		>
			<vc-paging
				:columns="showColumns"
				:show="item.ic_system_id == ic_system_id" 
				:type="item.ic_system_id"
				:data-source="listInfo[item.ic_system_id].data"
				:total="listInfo[item.ic_system_id].total"
				:reset="listInfo[item.ic_system_id].reset"
				:current.sync="current[item.ic_system_id]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: false}"
				class="v-sale-integral-sub-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-integral-sub-list',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane
	},
	mixins: [
		item,
		tableHeight({
			nav1: true,
			nav2: false,
			extra: 50
		})
	],
	data() {
		const { query } = this.$route;
		return {
			current: {},
			ic_system_id: query.ic_system_id
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleFractionIntegralSub.listInfo;
		},
		tabs() {
			return this.$store.state.saleFractionIntegralSub.tabs;
		},
		initIcSystemId() {
			return this.$store.state.saleFractionIntegralSub.ic_system_id;
		}
	},
	watch: {
		ic_system_id(value) {
			this.loadSelfHead(value);
		}
	},
	mounted() {
		this.loadTabsData();
		this.ic_system_id && this.loadSelfHead(this.ic_system_id);
	},
	methods: {
		/**
		 * 体系列表的tab
		 */
		loadTabsData() {
			let ic_system_ids = [];
			this.$request({
				url: '_SALE_TRAIN_INTEGRAL_TAB_GET',
				type: 'GET',
				loading: false,
				param: { 
					first_depart: this.$global.staff.first_depart,
					cate: 1
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data)) {
					ic_system_ids = res.data.map(it => it.ic_system_id);
					this.$store.commit('SALE_FRACTION_INTEGRAL_SUB_TABS_GET_SUCCESS', { data: res.data, ic_system_ids });
				}
				this.ic_system_id = this.ic_system_id || this.initIcSystemId;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 自定义类型tab数据
		 */
		loadSelfHead(ic_system_id) {
			let { query = {} } = getParseUrl();
			let temp = { year: query.year } || {};
			this.$request({
				url: '_SALE_TRAIN_INTEGRAL_TABS_BY_YEAR_GET',
				type: 'GET',
				loading: false,
				param: { 
					...temp,
					ic_system_id
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data)) {
					this.showColumns = [...this.baseColumns];
					res.data.forEach(it => {
						this.showColumns.splice(7, 0, {
							title: it.type_name,
							key: it.tab_name,
							minWidth: 120
						});
					});
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 积分列表
		 */
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: "SALE_FRACTION_INTEGRAL_SUB_LIST_GET",
				type: 'GET',
				loading: false,
				param: {
					...query,
					cate: 1,
					is_sub: 1,
					ic_system_id: this.ic_system_id,
					page,
					pageSize
				},
				autoTip: false
			}).then((res) => {
				if (query.year) {
					this.loadSelfHead(this.ic_system_id);
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(ic_system_id) {
			this.ic_system_id = ic_system_id;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				ic_system_id,
				page: this.current[ic_system_id]
			};
			this.$router.replace(getHashUrl('/sale/fraction/integral/sub', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_FRACTION_INTEGRAL_SUB_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-sale-integral-sub-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
