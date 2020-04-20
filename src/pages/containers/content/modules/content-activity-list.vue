<template>
	<set-title title="活动列表" style="padding: 20px" class="g-tabs-card">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/content/activity-list/tabs-list';
import Filter from '@components/content/activity-list/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-activity-list',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_ACTIVITY_LIST')],
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
