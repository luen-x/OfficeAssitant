<template>
	<set-title 
		:routes="routes"
		title="导出设置" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-filter/>
		<oa-list style="margin-left:20px;"/>
	</set-title>
</template>

<script>
import List from '@components/sc/customer-cooperate-export/list';
import Filter from '@components/sc/customer-cooperate-export/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-customer-cooperate-export',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SC_CUSTOMER_COOPERATE_EXPORT')],
	data() {
		return {
			routes: [
				{
					path: `/sc/customer/cooperate`,
					name: '客户合同'
				},
				{
					path: '',
					name: '导出设置'
				}
			]
		};
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
