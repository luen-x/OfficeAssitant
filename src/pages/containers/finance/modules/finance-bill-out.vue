<template>
	<set-title title="出账记录" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/finance/bill-out/list';
import Filter from '@components/finance/bill-out/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-bill-out',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_BILL_OUT')],
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
