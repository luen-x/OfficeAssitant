<template>
	<set-title :routes="routes" title="招聘会-查看信息" style="padding: 20px">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/recruit-school-jobfair-info/content';

export default {
	name: 'oa-hr-recruit-school-jobfair-info',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		let { no_edit } = this.$route.query;
		return {
			routes: [
				{
					path: no_edit == 1 ? `/hr/recruit/school/statistics` : `/hr/recruit/school/jobfair/school`,
					name: no_edit == 1 ? '校招统计' : '合作学校'
				},
				{
					path: '',
					name: '招聘会信息'
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
