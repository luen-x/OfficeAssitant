<template>
	<set-title
		class="g-tabs-card"
		title="员工分配"
		style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-allocation/tabs-list';
import Filter from '@components/hr/employee-allocation/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-allocation',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_WAR')],
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
