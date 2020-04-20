<template>
	<set-title title="更新通知" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/tech/project-publish-notice/tabs-list';
import Filter from '@components/tech/project-publish-notice/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-tech-project-publish-notice',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('TECH_PROJECT_PUBLISH_NOTICE')],
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
