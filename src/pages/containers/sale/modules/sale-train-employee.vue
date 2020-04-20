<template>
	<set-title title="员工学习" style="padding: 20px" class="g-of-h g-hide-scroll">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/train-employee/list';
import Filter from '@components/sale/train-employee/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-train-employee',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_TRAIN_EMPLOYEE')],
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
