<template>
	<set-title title="积分体系" class="g-tabs-card" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/employee-score-integration/content';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-score-integration',
	components: {
		"oa-content": Content,
	},
	mixins: [navigator('HR_EMPLOYEE_SCORE_INTEGRATION')],
	data() {
		return {
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
