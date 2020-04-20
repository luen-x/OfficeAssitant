<template>
	<set-title :routes="routes" title="级称体系">
		<oa-info />
	</set-title>
</template>

<script>

import Info from '@components/hr/rank-info/info';

export default {
	name: 'oa-hr-rank-info',
	components: {
		'oa-info': Info
	},
	data() {
		let { query } = this.$route;
		return {
			routes: [
				{
					path: '/hr/system/assess/rank',
					name: query.rank_system_id ? '修改级称' : '新增级称体系',
				},
				{
					path: '',
					name: this.$route.query.depart_name
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
