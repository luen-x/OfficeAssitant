<template>
	<set-title
		title="社招统计"
		class="g-tabs-card"
		style="padding: 20px;paddingTop: 15px;">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-social-transform/tabs-list';
import Filter from '@components/hr/recruit-social-transform/filter/root';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-social-transform',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SOCIAL_TRANSFORM')],
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
