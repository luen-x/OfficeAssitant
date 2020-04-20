<template>
	<set-title :routes="routes" title="笔试预览">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/recruit-school-paper-result';

export default {
	name: 'oa-hr-recruit-school-paper-result',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: '笔试预览'
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
