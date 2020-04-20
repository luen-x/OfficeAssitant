<template>
	<set-title title="活动分类" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/activity-classify/list';
import Filter from '@components/content/activity-classify/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-activity-classify',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_ACTIVITY_CLASSIFY')],
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
