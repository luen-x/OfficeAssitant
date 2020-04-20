<template>
	<set-title
		:routes="routes"
		title="销售数据-成本统计" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-content class="g-pd-tb-20"/>
		<oa-filter/>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-sale-cost/list';
import Filter from '@components/statistic/business-sale-cost/filter';
import navigator from '@extends/mixins/navigator';
import Content from '@components/statistic/business-sale-cost/content';

export default {
	name: 'oa-statistic-business-sale-cost',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
		"oa-content": Content
	},
	mixins: [navigator('STATISTIC_BUSINESS_SALE_COST')],
	data() {
		return {
			routes: [
				{
					path: '/statistic/business/sale',
					name: '产品成本'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
</style>