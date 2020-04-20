<template>
	<set-title :routes="route" class="g-tabs-card" title="积分排名" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/employee-score-integration-rank/content';

export default {
	name: 'oa-hr-employee-score-integration-rank',
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
					path: '/hr/employee/score/integration/rank',
					name: '积分排名'
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
