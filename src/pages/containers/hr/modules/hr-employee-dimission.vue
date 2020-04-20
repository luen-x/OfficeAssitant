<template>
	<set-title title="转岗流程">
		<oa-dimission />
	</set-title>
</template>

<script>

import Dimission from '@components/hr/employee-dimission/dimission.vue';

export default {
	name: 'oa-hr-employee-dimission',
	components: {
		'oa-dimission': Dimission
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
