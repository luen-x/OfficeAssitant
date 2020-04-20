<template>
	<set-title :routes="routes" title="邮件列表" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/recruit-school-summary-elists/list';
import Filter from '@components/hr/recruit-school-summary-elists/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-summary-elists',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_SUMMARY_ELISTS')],
	data() {
		return {
			routes: [
				{
					path: this.$route.query.recruitType === 'school' ? '/hr/recruit/school/summary' : '/hr/recruit/social/summary',
					name: this.$route.query.recruitType === 'school' ? '校招总表' : '社招跟进'
				},
				{
					path: '',
					name: '邮件列表'
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
