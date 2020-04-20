<template>
	<set-title title="黑名单" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/recruit-social-blacklist/list';
import Filter from '@components/hr/recruit-social-blacklist/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-social-blacklist',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SOCIAL_BLACKLIST')],
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
