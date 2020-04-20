<template>
	<set-title :routes="routes" title="招聘会学校" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/recruit-school-jobfair-school/list';
import Filter from '@components/hr/recruit-school-jobfair-school/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-jobfair-school',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL')],
	data() {
		return {
			routes: [
				{
					path: `/hr/recruit/school/jobfair`,
					name: '招聘会'
				},
				{
					path: '',
					name: '合作学校'
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
