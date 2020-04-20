<template>
	<set-title title="服务项管理" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/service-setting/list';
import Filter from '@components/content/service-setting/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-service-setting',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_SERVICE_SETTING')],
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
