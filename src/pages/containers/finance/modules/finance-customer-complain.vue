<template>
	<set-title title="服务提成申诉" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/customer-complain/tabs-list';
import Filter from '@components/finance/customer-complain/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-customer-complain',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_CUSTOMER_COMPLAIN')],
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
