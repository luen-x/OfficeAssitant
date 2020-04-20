<template>
	<set-title title="数据统计">
		<oa-content/>
	</set-title>
</template>

<script>

import Content from '@components/sc/manage-statistics-data/content';

export default {
	name: 'oa-sc-manage-statistics-data',
	components: {
		'oa-content': Content
	}
};
</script>

<style lang="scss" scoped>
</style>