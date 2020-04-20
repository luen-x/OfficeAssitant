<template>
	<set-title title="客户数据">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/statistic/business-customer/content';

export default {
	name: 'oa-statistic-business-customer',
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
