<template>
	<set-title :routes="routes" title="统计详情" class="g-tabs-card" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/content/config-statistics-manage-detail/tabs-list';
import Filter from '@components/content/config-statistics-manage-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-config-statistics-manage-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_CONFIG_STATISTICS_MANAGE_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '详情'
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
