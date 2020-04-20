<template>
	<set-title title="历史数据" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/salary-social-history/list';
import Filter from '@components/hr/salary-social-history/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-salary-social-history',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_SALARY_SOCIAL_HISTORY')],
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
