<template>
	<set-title title="微信推送" class="g-tabs-card" style="padding: 20px">
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/notice-wechat/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-notice-wechat',
	components: {
		"oa-list": List
	},
	mixins: [navigator('CONTENT_NOTICE_WECHAT')]
};
</script>

<style lang="scss" scoped>
</style>