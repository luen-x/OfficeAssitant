<template>
	<set-title title="评选规则" class="g-tabs-card">
		<oa-tabs-list />
	</set-title>
</template>

<script>

import TabsList from '@components/hr/employee-mentor-rule/tabs-list';

export default {
	name: 'oa-hr-employee-mentor-rule',
	components: {
		'oa-tabs-list': TabsList
	},
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
