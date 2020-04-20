<template>
	<set-title title="客户合同" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/customer-cooperate/tabs-list';
import Filter from '@components/sc/customer-cooperate/filter';
import navigator from '@extends/mixins/navigator';
import { delItem } from '@utils/utils';

export default {
	name: 'oa-sc-customer-cooperate',

	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},

	mixins: [navigator('SC_CUSTOMER_COOPERATE')],

	data() {
		return {
		};
	},

	created() {
	},

	beforeRouteLeave(to, from, next) {
		delItem(`look_mail_${app.$global.version}`);

		next();
	},

	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>