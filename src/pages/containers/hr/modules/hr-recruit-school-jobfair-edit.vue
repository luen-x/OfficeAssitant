<template>
	<set-title :routes="routes" title="招聘会-编辑信息" style="padding: 20px">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/recruit-school-jobfair-edit/content';

export default {
	name: 'oa-hr-recruit-school-jobfair-edit',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: `/hr/recruit/school/jobfair`,
					name: '招聘会'
				},
				{
					path: '',
					name: '编辑信息'
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
