<template>
	<div class="g-pd-t-20">
		<div class="g-flex g-m-lr-20 g-m-b-20">
			<oa-deal-statistic class="g-col"/>
			<oa-payment-rank class="g-m-l-20"/>
		</div>
		<oa-deal-customer class="g-m-lr-20 g-m-b-20"/>
		<oa-renew-customer class="g-m-lr-20 g-m-b-20"/>
		<oa-rebuy-customer class="g-m-lr-20 g-m-b-20"/>
		<oa-renew-product class="g-m-lr-20 g-m-b-20"/>
		
	</div>

</template>

<script>
import moment from 'moment';
import DealS from './part/deal-statistic';
import PaymentRank from './part/payment-rank';
import DealCustomer from './part/deal-customer';
import RebuyCustomer from './part/rebuy-customer';
import RenewCustomer from './part/renew-customer';
import RenewProduct from './part/renew-product';

export default {
	name: 'oa-tpl',
	components: {
		'oa-deal-statistic': DealS,
		'oa-payment-rank': PaymentRank,
		'oa-deal-customer': DealCustomer,
		'oa-rebuy-customer': RebuyCustomer,
		'oa-renew-customer': RenewCustomer,
		'oa-renew-product': RenewProduct
	},
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
