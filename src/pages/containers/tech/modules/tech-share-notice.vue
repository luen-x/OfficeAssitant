<template>
	<set-title :routes="routes" title="更新通知">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/tech/share-notice/content';

export default {
	name: 'oa-tech-share-notice',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [{
				path: '',
				name: '更新通知'
			}]
		};
	}
};
</script>

<style lang="scss" scoped>
</style>