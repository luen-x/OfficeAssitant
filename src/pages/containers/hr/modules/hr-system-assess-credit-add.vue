<template>
	<set-title :routes="route" :title="title">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/system-assess-credit-add/content';

export default {
	name: 'oa-hr-system-assess-credit-add',
	components: {
		'oa-content': Content
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/system/assess/credit',
					name: '学分配置'
				},
				{
					path: '/hr/system/assess/credit/add',
					name: query.ic_system_id ? '编辑' : '新增' 
				}
			]
		};
	},
	computed: {
		title() {
			const { query } = this.$route;
			return "学分" + query.ic_system_id ? '编辑' : '新增';
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
