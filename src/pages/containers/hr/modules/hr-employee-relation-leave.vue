<template>
	<set-title title="员工关系-离职管理" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-relation-leave/tabs-list';
import Filter from '@components/hr/employee-relation-leave/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-relation-leave',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_EMPLOYEE_RELATION_LEAVE')],
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
