<template>
	<set-title :routes="routes" title="功能解读">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/tech/share-document/content';

export default {
	name: 'oa-tech-share-document',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [{
				path: '',
				name: '功能解读'
			}]
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
