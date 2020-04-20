<template>
	<set-title :routes="route" class="g-tabs-card" title="积分导入" style="padding: 20px">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/employee-score-integration-leadin/__tpl__';

export default {
	name: 'oa-hr-employee-score-integration-leadin',
	components: {
		'oa-tpl': Tpl
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
					path: '/hr/employee/score/integration/leadin',
					name: '导入'
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
