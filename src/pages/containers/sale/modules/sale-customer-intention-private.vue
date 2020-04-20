<template>
	<set-title :routes="routes" title="私海" class="g-tabs-card" style="padding: 20px;min-width:690px">

		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/customer-intention-private/list';
import Filter from '@components/sale/customer-intention-private/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-intention-private',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_INTENTION_PRIVATE')],
	data() {
		return {
			routes: [{ name: '私海', path: '' }]
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
