<template>
	<set-title title="课程设置" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/setting-course/tabs-list';
import Filter from '@components/collage/setting-course/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-setting-course',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_SETTING_COURSE')],
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
