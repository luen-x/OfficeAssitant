<template>
	<set-title :routes="routes" title="营销中心员工业绩详情" class="g-tabs-card" style="padding: 20px">
		<!-- <oa-performance /> -->
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/count-staff-detail/tabs-list';
// import Performance from '@components/finance/count-staff-detail/performance';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-count-staff-detail',
	components: {
		"oa-tabs-list": TabsList,
		// "oa-performance": Performance,
	},
	mixins: [navigator('FINANCE_COUNT_STAFF_DETAIL')],
	data() {
		const { query = {} } = this.$route;
		const name = query.staff_name;
		return {
			routes: [
				{
					path: '/finance/count/staff/sale',
					name: '营销中心'
				},
				{
					path: '',
					name
				}
			],
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
