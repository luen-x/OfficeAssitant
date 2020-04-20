<template>
	<set-title title="员工客户-成交客户" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/archives-employee-customer/list';
import Filter from '@components/hr/archives-employee-customer/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-employee-customer',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ARCHIVES_EMPLOYEE_CUSTOMER')],
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
