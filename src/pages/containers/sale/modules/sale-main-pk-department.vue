<template>
	<set-title title="部门PK" style="padding: 20px">
		<oa-pk-head/>
		<oa-common-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/main-pk-department/list';
// import Filter from '@components/sale/main-pk-department/filter';
import commonFilter from '@components/sale/main-pk-department/_common/common-filter';
import navigator from '@extends/mixins/navigator';
import PkHead from '@components/sale/main-pk-department/_common/pk-head';
import PkSummary from '@components/sale/main-pk-department/_common/pk-summary';

export default {
	name: 'oa-sale-main-pk-department',
	components: {
		"oa-list": List,
		// "oa-filter": Filter,
		'oa-common-filter': commonFilter,
		"oa-pk-head": PkHead,
	},
	mixins: [navigator('SALE_MAIN_PK_DEPARTMENT')],
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
