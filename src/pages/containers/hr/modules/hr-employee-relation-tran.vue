<template>
	<set-title title="员工关系-员工转岗" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-relation-tran/tabs-list';
import Filter from '@components/hr/employee-relation-tran/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-manage-relation-tran',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_EMPLOYEE_RELATION_TRAN')],
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
