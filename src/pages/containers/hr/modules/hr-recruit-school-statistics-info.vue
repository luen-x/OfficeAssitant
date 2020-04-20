<template>
	<set-title :routes="routes" title="校招统计-查看信息" class="g-tabs-card" style="padding: 20px; padding-top: 70px !important">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-school-statistics-info/tabs-list';
import Filter from '@components/hr/recruit-school-statistics-info/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-statistics-info',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_STATISTICS_INFO')],
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/school/statistics',
					name: '校招统计'
				},
				{
					path: '',
					name: '查看信息'
				}
			]
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
