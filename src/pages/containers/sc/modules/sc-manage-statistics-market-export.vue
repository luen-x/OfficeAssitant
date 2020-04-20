<template>
	<set-title :routes="routes" title="导出任务" class="g-tabs-card" style="padding: 20px">
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sc/manage-statistics-market-export/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-manage-statistics-market-export',
	components: {
		"oa-list": List
	},
	mixins: [navigator('SC_MANAGE_STATISTICS_MARKET_EXPORT')],
	data() {
		return {
			routes: [
				{
					path: '/sc/manage/statistics/market',
					name: '市场服务数据'
				},
				{
					path: '',
					name: '导出任务'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
</style>