<template>
	<set-title title="提成设置" class="g-tabs-card" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/salary-per/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-salary-per',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_SALARY_PER')],
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
