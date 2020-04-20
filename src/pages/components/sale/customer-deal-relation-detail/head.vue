<template>
	<div class="v-sale-relation-detail-head g-m-t-20">
		<h3>{{ basicInfo.contract_company_name || '--' }}</h3>
		<div>
			<span class="_label">
				客户姓名：
				<span class="g-c-black1">{{ basicInfo.customer_name || '--' }}</span>
			</span>
			<span class="_label">
				客户手机号：
				<span class="g-c-black1">{{ basicInfo.phone || '--' }}</span>
			</span>
			<span class="_label">
				邀约人：
				<span v-if="!basicInfo.staff_name && !basicInfo.depart_name" class="g-c-black1">--</span>
				<span v-else class="g-c-black1">
					{{ basicInfo.staff_name + (basicInfo.depart_name ? '(' + basicInfo.depart_name + ')' : '') }}
				</span>
			</span>
		</div>
		<div>
			<span style="max-width:800px;display: inline-block;margin-top: 10px;">
				我方合同公司：
				<span class="g-c-black1">{{ basicInfo.our_company_name || '--' }}</span>
			</span>
		</div>
	</div>
</template>
<script>
import API_ROOT from "@stores/apis/root";

export default {
	name: 'oa-relation-detail-head',
	components: {},
	data() {
		const { query } = this.$route;

		return {
			contractCompanyId: query.contract_company_id,
			basicInfo: {}
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._SALE_RELATE_CUSTOMER_CONTRACT_INFO_GET,
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				this.basicInfo = res.data;
			}).catch(error => {
				this.$Message.error(error.msg); 
			});
		}
	}
};
</script>
<style lang="scss">
.v-sale-relation-detail-head {
	box-shadow: 0px 0px 5px 2px #eee;
	position: relative;
    padding: 20px 20px ;
    ._label {
        display: inline-block;
        width: 250px;
        margin-top: 10px;
    }
}
</style>
