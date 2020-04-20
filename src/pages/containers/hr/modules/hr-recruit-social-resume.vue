<template>
	<set-title :routes="$route.query.from==='person'?[]:routes" title="线上简历">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/recruit-social-resume/form';

export default {
	name: 'oa-hr-employee-summary-resume',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/social/summary',
					name: '社招跟进'
				},
				{
					path: '',
					name: '线上简历'
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