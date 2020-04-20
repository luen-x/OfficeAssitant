<template>
	<set-title :routes="routes" title="课程报名审核" class="g-tabs-card g-of-h" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list style="margin-bottom: 30px;"/>
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-train-schedule-add/tabs-list';
import Filter from '@components/hr/academy-train-schedule-add/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-schedule-add',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRAIN_SCHEDULE_ADD')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '课程报名审核'
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

<style lang="scss">
</style>
