<template>
	<set-title title="首页" class="g-tabs-card" style="padding: 20px">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/academy/main/content';

export default {
	name: 'oa-academy-main',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
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
