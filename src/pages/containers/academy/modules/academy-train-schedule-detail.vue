<template>
	<set-title :routes="routes" title="报名查看" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/train-schedule-detail/tabs-list';
import Filter from '@components/academy/train-schedule-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-train-schedule-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_TRAIN_SCHEDULE_DETAIL')],
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
