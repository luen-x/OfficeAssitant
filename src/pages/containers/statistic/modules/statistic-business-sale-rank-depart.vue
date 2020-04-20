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
import List from '@components/statistic/business-sale-rank-depart/list';
import Filter from '@components/statistic/business-sale-rank-depart/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-sale-rank-depart',
	components: {
		"oa-list": List,
		"oa-filter": Filter
	},
	mixins: [navigator('STATISTIC_BUSINESS_SALE_RANK_DEPART')],
	data() {
		return {
			routes: [
				{
					path: 'statistic/business/sale/rank',
					name: '业绩排名'	
				}
			]
		};
	},
	created() {
		const { query } = this.$route;
		query.page = '';
		query.pageSize = '';
		let params = [];

		for (let i in query) {
			if (query[i] && i != 'depart_name') {
				params.push(`${i}=${query[i]}`);
			}
		}

		this.routes[0] = {
			path: `/statistic/business/sale/rank?${params.join('&')}`,
			name: '业绩排名'
		};
		this.routes.push({
			path: '',
			name: this.$route.query.depart_name
		});
	}
};
</script>

<style lang="scss" scoped>
</style>