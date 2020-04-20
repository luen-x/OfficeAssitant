<template>
	<set-title title="下载统计" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/support-statistics-manage/tabs-list';
import Filter from '@components/academy/support-statistics-manage/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-support-statistics-manage',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_SUPPORT_STATISTICS_MANAGE')],
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
