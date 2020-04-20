<template>
	<set-title title="销售数据">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/statistic/business-sale/content';

export default {
	name: 'oa-statistic-business-sale',
	components: {
		'oa-content': Content
	}
};
</script>

<style lang="scss" scoped>
</style>