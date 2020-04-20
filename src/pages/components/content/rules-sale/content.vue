<template>
	<div class="g-tabs-card g-pd-t-20 v-content-rules-sale-content">
		<i-tabs v-model="type" type="card" style="height:inherit" @on-click="handleSearch">
			<i-tab-pane label="客户领取设置" name="1">
				<oa-customer-get-set/>
			</i-tab-pane>
			<i-tab-pane label="客户编辑设置" name="2">
				<oa-customer-edit/>
			</i-tab-pane>
			<i-tab-pane label="其他设置" name="3">
				<oa-other-set/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>

import { Tabs, TabPane } from 'iview';
import CustomerGetSet from '@components/sale/sea-setting/content';
import { getParseUrl, getHashUrl } from '@utils/utils';
import OtherSet from './other-set';
import CustomerEdit from './customer-edit';

export default {
	name: 'oa-tpl',
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"oa-customer-get-set": CustomerGetSet,
		"oa-customer-edit": CustomerEdit,
		'oa-other-set': OtherSet
	},
	data() {
		const { query } = this.$route;
		return {
			type: query.type || '',
		};
	},
	created() {
	},
	methods: {
		handleSearch(v) {
			this.$router.replace(getHashUrl(
				'/content/rules/sale',
				{
					type: v
				}
			));
		},
	},
};
</script>

<style lang="scss">
.v-content-rules-sale-content {
	height: inherit;
	.ivu-tabs {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-left: 20px;
	}
	.ivu-tabs-content {
		flex: 1;
		height: 0;
	}
	.ivu-tabs-tabpane {
		overflow: auto;
	// 	padding: 0 20px;
	// 	overflow-y: auto;
	// 	overflow-x: hidden;
	// 	max-height: 100%;
	}

}


</style>
