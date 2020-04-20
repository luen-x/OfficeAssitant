<template>
	<set-title :routes="routes" title="报名查看" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/main-enroll/tabs-list';
import Filter from '@components/academy/main-enroll/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-main-enroll',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_MAIN_ENROLL')],
	data() {
		return {
			routes: [
				{
					name: "报名查看"
				}
			]
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
