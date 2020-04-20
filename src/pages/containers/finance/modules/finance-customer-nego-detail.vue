<template>
	<set-title :routes="routes" title="成交客户详情" class="g-tabs-card" style="padding: 20px">
		<oa-info />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/customer-nego-detail/tabs-list';
import Info from '@components/finance/customer-nego-detail/info';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-customer-nego-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-info": Info,
	},
	mixins: [navigator('FINANCE_CUSTOMER_NEGO_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '客户详情'
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
