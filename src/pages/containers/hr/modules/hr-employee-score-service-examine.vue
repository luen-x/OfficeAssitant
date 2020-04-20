<template>
	<set-title title="服务审核" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-score-service-examine/tabs-list';
import Filter from '@components/hr/employee-score-service-examine/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-score-service-examine',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_EMPLOYEE_SCORE_SERVICE_EXAMINE')],
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
