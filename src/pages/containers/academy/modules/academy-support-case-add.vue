<template>
	<set-title :routes="routes" title="添加案例">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/academy/support-case-add/content';

export default {
	name: 'oa-academy-support-case-add',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [{ name: '添加案例', path: '' }]
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
