<template>
	<set-title title="抽奖" style="padding: 20px">
		<oa-content/>
	</set-title>
</template>

<script>
import navigator from '@extends/mixins/navigator';
import Content from '@components/hr/academy-detail-draw-full-screen/content';

export default {
	name: 'oa-hr-academy-draw-full-screen',
	components: {
		'oa-content': Content
	},
	mixins: [navigator('HR_ACADEMY_COURSE_PAPER_ADD')],
	data() {
		return {};
	},
	created() {
	},
	mounted() {
		document.body.style.overflow = 'hidden';
	},
	beforeDestroy() {
		document.body.style.overflow = 'auto';
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
