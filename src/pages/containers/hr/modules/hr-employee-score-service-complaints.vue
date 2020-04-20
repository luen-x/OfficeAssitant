<template>
	<set-title title="服务申诉" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-score-service-complaints/tabs-list';
import Filter from '@components/hr/employee-score-service-complaints/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-score-service-complaints',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS')],
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
