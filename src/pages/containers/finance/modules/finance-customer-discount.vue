<template>
	<set-title title="打折申请" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/customer-discount/tabs-list';
import Filter from '@components/finance/customer-discount/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-customer-discount',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_CUSTOMER_DISCOUNT')],
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
