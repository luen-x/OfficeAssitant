<template>
	<set-title title="事项类型" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/administration/matter-setting-type/list';
import Filter from '@components/administration/matter-setting-type/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-administration-matter-setting-type',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ADMINISTRATION_MATTER_SETTING_TYPE')],
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
