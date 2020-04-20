<template>
	<set-title :routes="route" class="g-tabs-card" title="学分导入" style="padding: 20px">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/employee-score-credit-leadin/__tpl__';

export default {
	name: 'oa-hr-employee-score-credit-leadin',
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
					path: '/hr/employee/score/credit/leadin',
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
