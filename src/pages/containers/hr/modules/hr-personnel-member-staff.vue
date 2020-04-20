<template>
	<set-title title="我的员工" style="padding: 20px" class="g-tabs-card">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/personnel-member-member-staff/list';
import Filter from '@components/hr/personnel-member-member-staff/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-personnel-member-member-staff',
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
