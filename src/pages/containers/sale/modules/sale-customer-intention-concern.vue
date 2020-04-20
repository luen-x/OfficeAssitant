<template>
	<set-title :routes="routes" title="我的关注资料" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/customer-intention-concern/list';
import Filter from '@components/sale/customer-intention-concern/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-intention-concern',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_INTENTION_CONCERN')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '我关注的资料'
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
