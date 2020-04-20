<template>
	<set-title title="课程支持" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/support-course/tabs-list';
import Filter from '@components/academy/support-course/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-support-course',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_SUPPORT_COURSE')],
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
