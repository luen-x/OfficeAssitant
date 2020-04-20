<template>
	<set-title title="下载记录" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/academy/support-tool-download/list';
import Filter from '@components/academy/support-tool-download/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-support-tool-download',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_SUPPORT_TOOL_DOWNLOAD')],
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
