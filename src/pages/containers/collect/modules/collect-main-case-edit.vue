<template>
	<set-title :routes="routes" title="collect-main-case-edit">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/collect/main-case-edit/content';

export default {
	name: 'oa-collect-main-case-edit',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [{ path: '', name: '编辑案例' }]
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
