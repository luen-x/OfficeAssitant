<template>
	<set-title title="PK统计" style="padding: 20px; min-width: 1150px;">
		<oa-pk-head/>
		<oa-common-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/main-pk-statistic/list';
import commonFilter from '@components/sale/main-pk-department/_common/common-filter';
import PkHead from '@components/sale/main-pk-department/_common/pk-head';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-main-pk-statistic',
	components: {
		"oa-list": List,
		"oa-common-filter": commonFilter,
		"oa-pk-head": PkHead,
	},
	mixins: [navigator('SALE_MAIN_PK_STATISTIC')],
	data() {
		return {
		};
	},
	computed: {
		
	},
	created() {
	},
	mounted() {

	},
	beforeDestroy() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
