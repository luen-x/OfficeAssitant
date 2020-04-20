<template>
	<set-title :routes="routes" title="社招统计表详情" style="padding: 20px">
		<oa-filter/>
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/social-statistics-details/list';
import Filter from '@components/hr/social-statistics-details/filter';

export default {
	name: 'oa-hr-social-statistics-details',
	components: {
		"oa-filter": Filter,
		"oa-content": Content,
	},
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/social/statistics?type=social-statistics',
					name: '社招统计表'
				},
				{
					path: '',
					name: '查看详情'
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