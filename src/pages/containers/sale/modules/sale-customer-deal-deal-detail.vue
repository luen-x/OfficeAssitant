<template>
	<set-title :routes="routes" title="客户详情" class="g-tabs-card" style="padding: 20px">
		<oa-head />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/customer-deal-deal-detail/tabs-list';
import Head from '@components/sale/customer-deal-deal-detail/head';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-deal-deal-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-head": Head,
	},
	mixins: [navigator('SALE_CUSTOMER_DEAL_DEAL_DETAIL')],
	data() {
		return {
			routes: [{ name: "客户详情", path: '' }]
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
