<template>
	<set-title title="我的学习" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/train-study/tabs-list';
import Filter from '@components/sale/train-study/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-train-study',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_TRAIN_STUDY')],
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
