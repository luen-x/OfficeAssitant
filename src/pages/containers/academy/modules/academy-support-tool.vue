<template>
	<set-title title="academy-support-tool" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/support-tool/tabs-list';
import Filter from '@components/academy/support-tool/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-support-tool',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_SUPPORT_TOOL')],
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
