<template>
	<set-title :routes="routes" title="查看详情">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/personnel-member-detail/content';

export default {
	name: 'oa-hr-personnel-member-detail',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '/hr/personnel/member/distribution',
					name: '校招分配'
				},
				{
					path: '',
					name: '查看详情'
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
