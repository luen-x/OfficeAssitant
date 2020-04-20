<template>
	<set-title :routes="routes" title="职位详情" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-social-statistics-position-details/tabs-list';
import Filter from '@components/hr/recruit-social-statistics-position-details/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-social-statistics-position-details',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SOCIAL_STATISTICS_POSITION_DETAILS')],
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/social/statistics?type=position-analyze',
					name: '社招统计'
				},
				{
					path: '',
					name: '职位详情'
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
