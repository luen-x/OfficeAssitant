<template>
	<set-title title="服务提成" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/finance/services-commission/list';
import Filter from '@components/finance/services-commission/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-services-commission',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_SERVICES_COMMISSION')],
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
