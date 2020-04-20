<template>
	<set-title title="流程管理">
		<oa-workflow />
	</set-title>
</template>

<script>

import Workflow from '@components/hr/tool-workflow/workflow';

export default {
	name: 'oa-hr-tool-workflow',
	components: {
		'oa-workflow': Workflow
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
