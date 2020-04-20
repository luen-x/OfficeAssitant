<template>
	<set-title 
		title="详情信息" 
		class="g-tabs-card"
		style="padding: 20px"
	>
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/academy-train-detail-basic-0-info/content';
// import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-detail-basic-0-info',
	components: {
		"oa-content": Content,
	},
	// mixins: [navigator('HR_ACADEMY_TRAIN_DETAIL_BASIC_0_INFO')],
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
