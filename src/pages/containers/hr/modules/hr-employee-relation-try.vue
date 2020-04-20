<template>
	<set-title title="员工关系-试用转正" class="g-tabs-card" style="padding: 20px;">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-relation-try/tabs-list';
import Filter from '@components/hr/employee-relation-try/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-relation-try',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_EMPLOYEE_RELATION_TRY')],
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
