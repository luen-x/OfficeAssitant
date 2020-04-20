<template>
	<set-title :routes="routes" title="业务数据" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/customer-business-check/list';
import Filter from '@components/sale/customer-business-check/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-business-check',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_BUSINESS_CHECK')],
	data() {
		return {
			routes: [
				{
					path: ``,
					name: '详情'
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
