<template>
	<set-title :routes="route" class="g-tabs-card" title="积分详情" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/employee-score-integration-detail/content';

export default {
	name: 'oa-hr-employee-score-integration-detail',
	components: {
		"oa-content": Content,
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/employee/score/integration',
					name: '积分体系'
				},
				{
					path: '/hr/employee/score/integration/detail',
					name: '积分详情'
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
