<template>
	<set-title :routes="route" :title="title">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/system-assess-up-add/content';

export default {
	name: 'oa-hr-system-assess-up-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/system/assess/up',
					name: '晋升配置'
				},
				{
					path: '/hr/system/assess/up/add',
					name: query.recommend_conf_id ? '修改' : '启用晋升' 
				}
			]
		};
	},
	computed: {
		title() {
			const { query } = this.$route;
			return query.recommend_conf_id ? '修改' : '启用晋升';
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
