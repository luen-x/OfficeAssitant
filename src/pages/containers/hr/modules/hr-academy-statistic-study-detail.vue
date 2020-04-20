<template>
	<set-title :routes="routes" title="人才梯队" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-statistic-study-detail/list';
import Filter from '@components/hr/academy-statistic-study-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-statistic-study-detail',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_STATISTIC_STUDY_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: `/hr/academy/statistic/study`,
					name: '学员学习记录'
				},
				{
					path: '',
					name: '人才梯队'
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
