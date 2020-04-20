<template>
	<set-title
		:routes="routes"
		title="销售数据-退款统计" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-filter class="g-pd-t-20"/>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-sale-refund/list';
import Filter from '@components/statistic/business-sale-refund/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-sale-refund',
	components: {
		"oa-list": List,
		"oa-filter": Filter
	},
	mixins: [navigator('STATISTIC_BUSINESS_SALE_REFUND')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '退款详情'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
</style>