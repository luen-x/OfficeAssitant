<template>
	<set-title :routes="routes" title="总监分配">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/recruit-school-tryassign-chief/content';

export default {
	name: 'oa-hr-recruit-school-tryassign-chief',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/school/tryassign',
					name: '试岗分配'
				},
				{
					path: '',
					name: '总监分配'
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
