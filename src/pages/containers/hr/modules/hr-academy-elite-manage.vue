<template>
	<set-title :routes="routes" title="课题管理">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/academy-elite-manage/content';

export default {
	name: 'oa-hr-academy-elite-manage',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: '课题管理'
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
