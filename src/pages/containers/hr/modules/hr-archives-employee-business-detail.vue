<template>
	<set-title
		:routes="routes"
		class="g-tabs-card"
		title="业务跟踪-详情"
		style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/archives-employee-business-detail/list';
import Filter from '@components/hr/archives-employee-business-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-employee-business-detail',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: `/hr/archives/employee/business`,
					name: '业务跟踪'
				},
				{
					path: '',
					name: '详情'
				}
			]
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
