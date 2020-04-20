<template>
	<set-title 
		:routes="routes" 
		title="销售数据" 
		class="g-tabs-card"
		style="padding: 20px"
	>
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/statistic/business-sale-rank/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-sale-rank',
	components: {
		"oa-tabs-list": TabsList
	},
	mixins: [navigator('STATISTIC_BUSINESS_SALE_RANK')],
	data() {
		return {
			routes: [
				{
					path: ' ',
					name: '业绩排名'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
</style>