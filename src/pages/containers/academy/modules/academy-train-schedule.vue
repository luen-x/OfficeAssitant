<template>
	<set-title title="课程表" class="g-tabs-card" style="padding: 20px">
		<oa-tpl />
	</set-title>
</template>

<script>

import Content from '@components/academy/train-schedule/content';

export default {
	name: 'oa-academy-train-schedule',
	components: {
		'oa-tpl': Content
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
