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
import TabsList from '@components/academy/transfer-statistics-teacher/tabs-list';
import Filter from '@components/academy/transfer-statistics-teacher/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-transfer-statistics-teacher',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter
	},
	mixins: [navigator('ACADEMY_TRANSFER_STATISTICS_TEACHER')],
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