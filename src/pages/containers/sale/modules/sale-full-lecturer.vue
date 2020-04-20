<template>
	<set-title :routes="routes" title="线下课程表">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/full-lecturer/content';

export default {
	name: 'oa-sale-full-lecturer',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [

				{
					path: '',
					name: '线下课程表'
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
