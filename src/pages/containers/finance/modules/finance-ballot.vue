<template>
	<set-title title="开票审核" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/ballot/tabs-list';
import Filter from '@components/finance/ballot/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-ballot',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_BALLOT')],
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
