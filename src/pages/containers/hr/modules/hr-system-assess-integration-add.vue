<template>
	<set-title :routes="route" :title="title" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/system-assess-integration-add/content';

export default {
	name: 'oa-hr-system-assess-integration-add',
	components: {
		"oa-content": Content,
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/system/assess/integration',
					name: '积分配置'
				},
				{
					path: '/hr/system/assess/integration/add',
					name: query.ic_system_id ? '编辑' : '新增' 
				}
			]
		};
	},
	computed: {
		title() {
			const { query } = this.$route;
			return "积分" + query.ic_system_id ? '编辑' : '新增';
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
