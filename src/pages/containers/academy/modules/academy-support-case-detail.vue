<template>
	<set-title :routes="routes" title="案例详情">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/academy/support-case-detail/content';

export default {
	name: 'oa-academy-support-case-detail',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [{ name: '案例详情', path: '' }]
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
