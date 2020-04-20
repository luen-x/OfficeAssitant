<template>
	<set-title :routes="route" title="类目管理" style="padding: 20px">
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/information-publish-manage/list';
import Filter from '@components/content/information-publish-manage/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-information-publish-manage',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_INFORMATION_PUBLISH_MANAGE')],
	data() {
		return {
			route: [
				{
					name: '资料发布',
					path: '/content/information/publish'
				},
				{
					name: '类目管理',
					path: ''
				}
			]
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
