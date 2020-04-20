<template>
	<set-title title="项目总览" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/tech/project-plan-overview/list';
import Filter from '@components/tech/project-plan-overview/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-tech-project-plan-overview',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('TECH_PROJECT_PLAN_OVERVIEW')],
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
