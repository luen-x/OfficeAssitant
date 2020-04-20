<template>
	<set-title :routes="routes" class="g-tabs-card" title="业务数据" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/customer-business-detail/tabs-list';
import Filter from '@components/sale/customer-business-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-business-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_BUSINESS_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: ``,
					name: '查看'
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
