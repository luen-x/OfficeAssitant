<template>
	<set-title title="余额更改审核" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/customer-remain/tabs-list';
import Filter from '@components/finance/customer-remain/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-customer-remain',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_CUSTOMER_REMAIN')],
	data() {
		return {
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
