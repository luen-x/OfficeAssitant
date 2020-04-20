<template>
	<set-title title="社招跟进" class="hr-recruit-social-summary g-tabs-card" style="padding: 20px;">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-social-summary/tabs-list';
import Filter from '@components/hr/recruit-social-summary/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-social-summary',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SOCIAL_SUMMARY')],
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

<style lang="scss">
</style>
