<template>
	<set-title title="学分体系" class="g-tabs-card" style="padding: 20px">
		<!-- <oa-filter /> -->
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/employee-score-credit/content';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-score-credit',
	components: {
		"oa-content": Content,
	},
	mixins: [navigator('HR_EMPLOYEE_SCORE_CREDIT')],
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
