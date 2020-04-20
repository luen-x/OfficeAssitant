<template>
	<set-title :routes="routes" title="素材详情">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/content/circle-list-detail/content';

export default {
	name: 'oa-content-circle-list-detail',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [{ name: '素材详情', path: '' }]
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
