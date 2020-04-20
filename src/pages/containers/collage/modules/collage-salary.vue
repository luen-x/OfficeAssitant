<template>
	<set-title title="薪资统计" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/salary/tabs-list';
import Filter from '@components/collage/salary/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-salary',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_SALARY')],
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
