<template>
	<set-title title="活动审核" style="padding: 20px" class="g-tabs-card">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/content/activity-audit/tabs-list';
import Filter from '@components/content/activity-audit/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-activity-audit',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_ACTIVITY_AUDIT')],
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
