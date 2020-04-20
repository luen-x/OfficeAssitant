<template>
	<set-title :routes="routes" title="查看报名情况" class="g-tabs-card g-of-h" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/train-course-detail/tabs-list';
import Filter from '@components/sale/train-course-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-train-course-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_TRAIN_COURSE_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: ``,
					name: '查看报名情况'
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
