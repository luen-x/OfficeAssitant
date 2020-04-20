<template>
	<set-title :routes="routes" title="优劣势互荐表详情">
		<oa-list />
	</set-title>
</template>

<script>

import List from '@components/hr/archives-person-recommend/list';

export default {
	name: 'oa-hr-archives-person-recommend',
	components: {
		'oa-list': List
	},
	data() {
		return {
			routes: [
				{
					path: `/hr/archives/person`,
					name: '人员档案'
				},
				{
					path: '',
					name: '互荐表查看'
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