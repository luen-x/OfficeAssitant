<template>
	<set-title title="课程安排" class="g-tabs-card" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/sale/train-course/content';

export default {
	name: 'oa-sale-train-course',
	components: {
		"oa-content": Content,
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
