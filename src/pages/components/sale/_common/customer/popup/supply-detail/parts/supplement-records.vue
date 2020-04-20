<template>
	<div class="v-sale-supplement-records g-relative g-m-t-30" style="min-height:260px">
		<oa-loading v-if="loading"/>
		<oa-record :records="supplementRecord" >
			<div slot-scope="{data}">
				<template v-if="data.supply_id">
					<div>
						<span class="g-c-black4 g-fs-12">{{ data.create_time }}</span>
						<span v-if="data.type == 2" class="g-c-black1 g-fs-14 ">
							<span class="g-pd-lr-20">
								下单
							</span>
							<span class="g-pd-r-10">实付金额：{{ data.payment_amount }} </span>
							<span>
								{{ data.staff_name }}
							</span>
						</span>
						<span v-else class="g-c-black1 g-fs-14 ">
							<span class="g-pd-lr-20">
								补款
							</span>
							<span class="g-pd-r-10">补款金额：{{ data.payment_amount }} </span>
						</span>
					</div>
					<div class="g-c-black2">
						<div v-for="(item,i) in data.detail" :key="i">
							【{{ item.product_name }}】
							<span v-if="item.cost_amount!='0.00'" class="g-m-l-10">{{ data.type ==2 ? '实扣成本':'补交成本' }}：{{ item.cost_amount }} 元</span>
						</div>
					</div>
				</template>
				<div v-else>暂无补款记录</div>
			</div>
		</oa-record>
	</div>
</template>
<script >
import Loading from '@components/_common/loading/loading';
import Record from '../../../../record';


const typeName = {
	1: '补款',
	2: "下单"
};
export default {
	name: "oa-sale-customer-supplement-records",
	components: {
		'oa-record': Record,
		'oa-loading': Loading
	},
	props: {
		contractId: Number
	},
	data() {
		return {
			loading: false,
			supplementRecord: []
		};
	},
	computed: {
	},
	watch: {
		contractId() {
			this.loadData();
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loading = true;
			this.$request({
				url: "_SALE_CONTRACT_SUPPLEMENT_LIST_GET",
				type: "GET",
				param: { contract_id: this.contractId },
				loading: false,
			}).then(res => {
				if (res.data.length == 1) {
					res.data.unshift({ supply_id: 0 });
				}
				this.supplementRecord = res.data;
				this.loading = false;
			}).catch((res) => {
				this.loading = false;
				this.$Message.error(res.msg);
			});
		}
	}
};
</script>
<style lang="scss">
</style>