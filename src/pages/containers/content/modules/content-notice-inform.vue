<template>
	<set-title title="通知管理" style="padding: 20px" class="g-tabs-card">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/content/notice-inform/tabs-list';
import Filter from '@components/content/notice-inform/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-notice-inform',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter
	},
	mixins: [navigator('CONTENT_NOTICE_INFORM')]
};
</script>

<style lang="scss" scoped>
</style>