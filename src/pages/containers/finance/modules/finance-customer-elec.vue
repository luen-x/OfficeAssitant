<template>
	<set-title title="电子合同" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/customer-elec/tabs-list';
import Filter from '@components/finance/customer-elec/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-customer-elec',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_CUSTOMER_ELEC')],
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
