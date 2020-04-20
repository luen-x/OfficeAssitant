<template>
	<set-title title="员工PK" style="padding: 20px">
		<oa-pk-head/>
		<oa-common-filter />
		<oa-list />
		<div style="height: 200px"/>
	</set-title>
</template>

<script>
import List from '@components/sale/main-pk-staff/list';
import commonFilter from '@components/sale/main-pk-department/_common/common-filter';
import navigator from '@extends/mixins/navigator';
import PkHead from '@components/sale/main-pk-department/_common/pk-head';
import saleRouterConfig from '@components/layout/left/sale';

export default {
	name: 'oa-sale-main-pk-staff',
	components: {
		"oa-list": List,
		"oa-common-filter": commonFilter,
		"oa-pk-head": PkHead,
	},
	mixins: [navigator('SALE_MAIN_PK_STAFF')],
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
