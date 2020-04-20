<template>
	<set-title title="淘汰人才" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-social-talent/tabs-list';
import Filter from '@components/hr/recruit-social-talent/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-social-talent',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SOCIAL_TALENT')],
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
