<template>
	<set-title
		:routes="routes"
		class="g-tabs-card"
		title="业务跟踪-查看"
		style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/archives-employee-business-watch/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-employee-business-watch',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH')],
	data() {
		return {
			routes: [
				{
					path: `/hr/archives/employee/business`,
					name: '业务跟踪'
				},
				{
					path: '',
					name: '查看'
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
