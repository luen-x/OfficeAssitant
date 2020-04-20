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
			:key="item.ic_system_id"
			:label="item.system_name" 
			:name="item.ic_system_id + ''"
		>
			<vc-paging
				v-if="listInfo[item.ic_system_id]"
				:columns="columns"
				:show="item.ic_system_id == type" 
				:type="item.ic_system_id"
				:data-source="listInfo[item.ic_system_id].data"
				:total="listInfo[item.ic_system_id].total"
				:reset="listInfo[item.ic_system_id].reset"
				:current.sync="current[item.ic_system_id]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-hr-employee-score-credit-list"
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
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 100 })
	],
	props: {
		handleChangePageSize: Function,
		loadData: Function,
		listInfo: Object,
		tabs: Array,
		current: Object,
		handleChange: Function,
		cate: Number,
		type: String
	},
	data() {
		const { query } = this.$route;
		return {
		};
	},
	methods: {
		
	}
};

</script>

<style lang="scss">

</style>
