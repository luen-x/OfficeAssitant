<template>
	<set-title :routes="routes" :title="$route.query.echelon_id ? '编辑计划' : '新增计划'">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/academy-elite-add/content';

export default {
	name: 'oa-hr-academy-elite-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		const { query = {} } = this.$route;
		return {
			routes: [
				{
					path: '',
					name: (query.echelon_id ? '编辑计划-' : '新增计划-') + query.depart_name
				}]
		};
	},
	created() {
		// this.loadPositionData();
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
