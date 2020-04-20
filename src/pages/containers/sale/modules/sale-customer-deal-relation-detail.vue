<template>
	<set-title :routes="routes" title="客户详情" class="g-tabs-card" style="padding: 20px">
		<oa-head />
		<oa-list />
	</set-title>
</template>

<script>
import Head from '@components/sale/customer-deal-relation-detail/head';
import List from '@components/sale/customer-deal-relation-detail/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-deal-relation-detail',
	components: {
		'oa-head': Head,
		"oa-list": List
	},
	mixins: [navigator('SALE_CUSTOMER_DEAL_RELATION_DETAIL')],
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
