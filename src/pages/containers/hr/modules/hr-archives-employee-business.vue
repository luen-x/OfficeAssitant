<template>
	<set-title
		class="g-tabs-card"
		title="员工客户-业务跟踪"
		style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/archives-employee-business/tabs-list';
import Filter from '@components/hr/archives-employee-business/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-employee-business',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ARCHIVES_EMPLOYEE_BUSINESS')],
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
