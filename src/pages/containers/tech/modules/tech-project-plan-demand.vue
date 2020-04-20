<template>
	<set-title title="项目需求" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/tech/project-plan-demand/tabs-list';
import Filter from '@components/tech/project-plan-demand/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-tech-project-plan-demand',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('TECH_PROJECT_PLAN_DEMAND')],
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
