<template>
	<set-title :routes="route" title="学分详情" style="padding: 20px">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/employee-score-credit-detail/__tpl__';

export default {
	name: 'oa-hr-employee-score-credit-detail',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/employee/score/credit',
					name: '学分体系'
				},
				{
					path: '/hr/employee/score/credit/detail',
					name: '学分详情'
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
