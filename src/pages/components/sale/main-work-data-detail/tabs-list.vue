<template>
	<div class="v-sale-main-work-data-detail-list">
		
		<i-tabs 
			v-model="type" 
			:animated="false"
			type="card" 
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<oa-customer-pane 
				ref="p1"
				:init-date-range="initDateRange" 
				:show="true" 
				label="添加客户" 
				name="1"
				url="_SALE_MAIN_WORK_DATA_MORE_INFO_LIST_ADD_GET"
			/> 
			<oa-customer-pane 
				ref="p2"
				:init-date-range="initDateRange" 
				:show="true" 
				label="领取客户" 
				name="2"
				url="_SALE_MAIN_WORK_DATA_MORE_INFO_LIST_GET_GET"
			/>
			<oa-call-pane 
				ref="p3"
				:init-date-range="initDateRange" 
				:show="true" 
				label="OA电话" 
				name="3"
			/>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import CustomerPane from './tabs/customer-pane';
import CallPane from './tabs/call-pane';

export default {
	name: 'oa-table',
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-customer-pane': CustomerPane,
		'oa-call-pane': CallPane
	},
	data() {
		const { query } = this.$route;
		return {
			initDateRange: [query.start_time, query.end_time],
			type: query.type || "1", 
			current: {},
			tabs: [
				{ label: '添加客户', value: '3' }, 
				{ label: '领取客户', value: '1' }, 
				{ label: 'OA电话', value: '2' }
			],
		};
	},
	methods: {
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
			};
			this.$router.replace(getHashUrl('/sale/main/work/data/detail', { ...query }));
			this.$nextTick(() => {
				this.$refs['p' + type] && this.$refs['p' + type].$refs.tableTarget.$refs.tableTarget.handleResize();	
			});

		},
	}
};
</script>

<style lang="scss">
.v-sale-main-work-data-detail-list {

}


</style>
