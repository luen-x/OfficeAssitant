<template>
	<set-title :routes="routes" :title="$route.query.edit ? '编辑道具' : '发布道具'">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/property-control-add/content';

export default {
	name: 'oa-sale-property-control-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [{ name: this.$route.query.edit ? '编辑道具' : '发布道具' }]
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
