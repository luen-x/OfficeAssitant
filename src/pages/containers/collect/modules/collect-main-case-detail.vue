<template>
	<set-title :routes="routes" title="collect-main-case-detail">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/collect/main-case-detail/content';

export default {
	name: 'oa-collect-main-case-detail',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [{ path: '', name: '案例详情' }]
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
