<template>
	<set-title title="下载记录" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/academy/support-study-download/list';
import Filter from '@components/academy/support-study-download/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-support-study-download',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_SUPPORT_STUDY_DOWNLOAD')],
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
