<template>
	<set-title title="团队提成" class="g-tabs-card" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/salary-team/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-salary-team',
	components: {
		"oa-tabs-list": TabsList
	},
	mixins: [navigator('HR_SALARY_TEAM')],
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
