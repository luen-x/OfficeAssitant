<template>
	<set-title :routes="routes" class="g-tabs-card" title="查看凭证考试" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/train-study-examine/tabs-list';
import Filter from '@components/sale/train-study-examine/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-train-study-examine',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_TRAIN_STUDY_EXAMINE')],
	data() {
		return {
			routes: [{ name: "查看凭证考试" }]
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
