<template>
	<set-title :routes="routes" title="类目管理" class="g-tabs-card" style="padding: 0 20px 20px 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/tech/project-publish-document-category/tabs-list';
import Filter from '@components/tech/project-publish-document-category/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-tech-project-publish-document-category',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter
	},
	mixins: [navigator('TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY')],
	data() {
		return {
			routes: [{
				path: '/tech/project/publish/document',
				name: '功能解读'
			},
			{
				path: '',
				name: '类目管理'
			}]
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
