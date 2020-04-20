<template>
	<set-title :routes="routes" title="需求进度" class="g-tabs-card g-m-t-20" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/tech/share-progress/tabs-list';
import Filter from '@components/tech/share-progress/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-tech-share-progress',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('TECH_SHARE_PROGRESS')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '需求进度'
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
