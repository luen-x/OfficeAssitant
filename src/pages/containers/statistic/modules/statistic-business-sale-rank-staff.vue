<template>
	<set-title
		:routes="routes"
		title="销售数据-业绩排名" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-filter class="g-pd-t-20"/>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-sale-rank-staff/list';
import Filter from '@components/statistic/business-sale-rank-staff/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-sale-rank-staff',
	components: {
		"oa-list": List,
		"oa-filter": Filter
	},
	mixins: [navigator('STATISTIC_BUSINESS_SALE_RANK_STAFF')],
	data() {
		return {
			routes: []
		};
	},
	created() {
		const { query } = this.$route;
		query.page = '';
		query.pageSize = '';
		let params = [];
		let param = '';

		for (let i in query) {
			if (query[i] && !['staff_name', 'is_staff', 'staff_id'].includes(i)) {
				params.push(`${i}=${query[i]}`);
			}
		}

		param = params.join('&') + (query.is_staff ? '&staff_id=' + query.staff_id : '');

		if (query.type) {
			this.routes = [
				{
					path: '',
					name: '业绩排名'
				},
				{
					path: `/statistic/business/sale/rank/depart?${param}`,
					name: query.depart_name
				},
				{
					path: '',
					name: query.staff_name
				}
			];
		} else {
			this.routes = [
				{
					path: `/statistic/business/sale/rank?${param}`,
					name: '业绩排名'
				},
				{
					path: '',
					name: query.staff_name
				}
			];
		}
	}
};
</script>

<style lang="scss" scoped>
</style>