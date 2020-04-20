<template>
	<div class="oa-sale-refund-contract-info g-relative" style="min-height:260px;width:680px">
		<oa-loading v-if="loading"/>
		<oa-info-block v-for="(item,index ) in contractInfoList" :key="index" :title="refundType[item.type]" >
			<span slot="extra">{{ item.time }}</span>
			<template v-if="item.type==1">
				<oa-info-item :content="item.payment_amount" label="补款金额" />
				<oa-info-item :content="item.total_cost_amount" label="扣除成本" />
				<oa-info-item :content="item.commission_performance" label="提成业绩" />
				<oa-info-item :content="item.total_service_amount" label="服务提成" />
			</template>
			<template v-else-if="item.type==2">
				<oa-info-item :content="item.payment_amount" label="实付金额" />
				<oa-info-item :content="item.commission_performance" label="提成业绩" />
				<oa-info-item :content="item.total_service_amount" label="服务提成" />
			</template>
		</oa-info-block>
	</div>
</template>
<script >
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import InfoBlock from '../../../../info-block';
import InfoItem from '../../../../info-item';

const refundType = {
	1: "补款",
	2: "下单"
};

// 款项信息
export default {
	name: "oa-sale-refund-contract-info",
	components: {
		'oa-info-block': InfoBlock,
		'oa-info-item': InfoItem,
		'oa-loading': Loading
	},
	props: {
		contractId: Number,
		projectId: Number,
	},
	data() {
		return {
			loading: false,
			refundType,
			contractInfoList: [],
		};
	},
	computed: {
	},
	watch: {
		contractId() {
			this.loadData();
		},
		projectId() {
			this.loadData();
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loadRefundContract();
		},
		loadRefundContract: debounce(function () {
			this.loading = true;
			this.$request({
				url: "_SALE_REFUND_CONTRACT_INFO_GET",
				type: "GET",
				param: { contract_id: this.contractId, project_id: this.projectId },
				loading: false,
			}).then(res => {
				this.contractInfoList = res.data;
				this.loading = false;
			}).catch((res) => {
				this.loading = false;
				this.$Message.error(res.msg);
			});
		}, 10) 
	}
};
</script>
<style lang="scss">
.oa-sale-refund-contract-info{
	position: relative;
}
</style>