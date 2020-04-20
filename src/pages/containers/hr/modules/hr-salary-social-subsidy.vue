<template>
	<set-title title="社保补贴" style="padding: 20px" class="g-tabs-card">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/salary-social-subsidy/tabs-list';
import Filter from '@components/hr/salary-social-subsidy/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-salary-social-subsidy',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_SALARY_SOCIAL_SUBSIDY')],
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
