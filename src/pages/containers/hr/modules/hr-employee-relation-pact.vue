<template>
	<set-title title="员工关系-员工合同" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-relation-pact/tabs-list';
import Filter from '@components/hr/employee-relation-pact/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-manage-relation-pact',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_EMPLOYEE_RELATION_PACT')],
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
