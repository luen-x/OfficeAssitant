<template>
	<set-title title="师傅评选" class="g-tabs-card" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-mentor-select/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-mentor-select',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_EMPLOYEE_MENTOR_SELECT')],
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
