<template>
	<set-title :routes="routes" title="上传素材">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/content/circle-list-add/__tpl__';

export default {
	name: 'oa-content-circle-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [{ path: '', name: '上传素材' }]
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
