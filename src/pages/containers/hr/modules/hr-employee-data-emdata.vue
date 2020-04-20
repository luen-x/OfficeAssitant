<template>
	<set-title title="数据分析-员工数据" style="padding: 20px;">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/employee-data-emdata/content';

export default {
	name: 'oa-hr-employee-data-emdata',
	components: {
		'oa-content': Content
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
