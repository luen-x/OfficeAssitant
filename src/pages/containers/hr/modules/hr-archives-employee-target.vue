<template>
	<set-title
		title="员工客户-目标跟进"
		class="g-tabs-card"
		style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/archives-employee-target/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-employee-target',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_ARCHIVES_EMPLOYEE_TARGET')],
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
