<template>
	<set-title :routes="routes" title="值班明细">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/tech/share-duty/content';

export default {
	name: 'oa-tech-share-duty',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: '值班明细'
				}
			]
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
