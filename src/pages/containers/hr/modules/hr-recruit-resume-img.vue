<template>
	<set-title :routes="routes" title="查看简历" class="g-pd-20">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/recruit-resume-img/__tpl__';

export default {
	name: 'oa-hr-recruit-resume-img',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: this.$route.query.recruitType === 'school' ? '/hr/recruit/school/summary' : '/hr/recruit/social/summary',
					name: this.$route.query.recruitType === 'school' ? '校招总表' : '社招跟进'
				},
				{
					path: '',
					name: '查看简历'
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
