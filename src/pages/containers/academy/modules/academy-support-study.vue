<template>
	<set-title title="academy-support-study" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/support-study/tabs-list';
import Filter from '@components/academy/support-study/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-support-study',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_SUPPORT_STUDY')],
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
