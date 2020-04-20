<template>
	<set-title :routes="route" class="g-tabs-card" title="学分排名" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/employee-score-credit-rank/content';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-score-credit-rank',
	components: {
		"oa-content": Content,
	},
	mixins: [navigator('HR_EMPLOYEE_SCORE_CREDIT_RANK')],
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/employee/score/credit',
					name: '学分体系'
				},
				{
					path: '/hr/employee/score/credit/rank',
					name: '学分排名'
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
