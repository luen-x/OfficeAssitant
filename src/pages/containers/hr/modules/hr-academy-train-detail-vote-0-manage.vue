<template>
	<set-title title="投票管理" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-train-detail-vote-0-manage/list';
import Filter from '@components/hr/academy-train-detail-vote-0-manage/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-detail-vote-0-manage',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRAIN_DETAIL_VOTE_0_MANAGE')],
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
