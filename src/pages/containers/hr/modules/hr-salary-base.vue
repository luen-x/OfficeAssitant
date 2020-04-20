<template>
	<set-title title="底薪设置" class="g-tabs-card" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/salary-base/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-salary-base',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_SALARY_BASE')],
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
