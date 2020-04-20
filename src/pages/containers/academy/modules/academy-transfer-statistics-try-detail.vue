<template>
	<set-title
		:routes="routes"
		title="数据统计-查看"
		class="g-tabs-card"
		style="padding: 20px"
	>
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/transfer-statistics-try-detail/tabs-list';
import Filter from '@components/academy/transfer-statistics-try-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-transfer-statistics-try-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter
	},
	mixins: [navigator('ACADEMY_TRANSFER_STATISTICS_TRY_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: '/academy/transfer/statistics',
					name: '数据统计'
				},
				{
					path: '',
					name: '查看'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
</style>