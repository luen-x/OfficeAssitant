<template>
	<set-title :routes="route" title="">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/system-assess-statistics-add/content';

export default {
	name: 'oa-hr-system-assess-statistics-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/system/assess/statistics',
					name: '互荐表配置'
				},
				{
					path: '/hr/system/assess/statistics/add',
					name: query.recommend_conf_id ? '编辑' : '新增' 
				}
			]
		};
	},
	computed: {
		title() {
			const { query } = this.$route;
			return '互荐表配置' + query.recommend_conf_id ? '编辑' : '新增';
		}
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
