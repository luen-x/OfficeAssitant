<template>
	<div class="g-pd-20">
		<oa-success-customer 
			v-if="deal.title"
			:deal="deal"
			class="g-m-t-10"
		/>
		<oa-customer-distribution 
			v-if="no_deal.title"
			:no-deal="no_deal"
			class="g-m-t-30"
		/>
		<oa-customer-type/>
		<oa-count class="g-m-t-30"/>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import SuccessCustomer from "./success-customer";
import CustomerDistribution from "./customer-distribution";
import CustomerType from "./customer-type";
import Count from "./count";

export default {
	name: 'oa-distribute',

	components: {
		"oa-success-customer": SuccessCustomer,
		"oa-customer-distribution": CustomerDistribution,
		"oa-customer-type": CustomerType,
		"oa-count": Count
	},

	data() {
		return {
			deal: {}, // 成交客户
			no_deal: {} // 未成交客户
		};
	},

	created() {
		this.handleGetData();
	},

	methods: {
		handleGetData() {
			this.$request({
				url: API_ROOT.STATISTICS_CUSTOMER_INDUSTRY_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.deal = res.data.deal;
				this.no_deal = res.data.no_deal;
			}).catch(error => {});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
