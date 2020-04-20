<template>
	<set-title title="类目设置" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/academy/support-study-set/list';
import Filter from '@components/academy/support-study-set/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-support-study-set',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_SUPPORT_STUDY_SET')],
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
