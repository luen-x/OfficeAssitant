<template>
	<div class="v-sale-customer-supply-info g-relative g-pd-t-20" style="min-height:260px">
		<oa-loading v-if="loading"/>
		<div class="g-m-b-20">
			<div>
				<span class="_title-bar g-bg-red-mid g-m-r-10"/>
				<span class="g-fs-14">财务审核</span>
			</div>
			<div class="g-flex g-fw-w" style="width:910px">
				<oa-info-item :content="financeAudit.audit_staff_name" label="审核人" />
				<oa-info-item :content="financeAudit.audit_time" label="审核时间" />
				<oa-info-item v-if="financeAudit.status ==1" content="待审核" label="审核状态"/>
				<oa-info-item v-else-if="financeAudit.status ==2" :content="financeAudit.audit_remark" tooltip label="通过说明" />
				<oa-info-item v-else :content="financeAudit.audit_remark" tooltip label="驳回说明" />
			</div>
		</div>
		<div class="g-m-b-20">
			<div>
				<span class="_title-bar g-bg-red-mid g-m-r-10"/>
				<span class="g-fs-14">款项信息</span>
			</div>
			<div class="g-flex g-fw-w" style="width:910px">
				<oa-info-item label="补款金额" >
					<oa-money-tooltip :total="supplyInfo.payment_amount" :data="supplyInfo.payment_amount_detail"/>
				</oa-info-item>
				<oa-info-item :content="supplyInfo.total_cost_amount" label="补交成本" >
					<oa-money-tooltip :total="supplyInfo.total_cost_amount" :data="supplyInfo.total_cost_amount_detail"/>
				</oa-info-item>
				<oa-info-item label="提成业绩">
					<oa-money-tooltip :total="supplyInfo.commission_performance" :data="supplyInfo.commission_performance_detail"/>
				</oa-info-item>
				<oa-info-item :content="supplyInfo.service_amount" label="服务提成" >
					<oa-money-tooltip :total="supplyInfo.service_amount" :data="supplyInfo.service_amount_detail"/>

				</oa-info-item>
			</div>
		</div>
		<template v-if="projectInfo.length">
			<div style="margin-bottom:20px">
				<span class="_title-bar g-bg-red-mid g-m-r-10"/>
				<span class="g-fs-14">产品信息</span>
			</div>
			<div v-for="(supply,index) in projectInfo " :key="index" class="g-m-b-20">
				<div style="margin-bottom:-10px">
					<span class="g-c-black1">{{ supply.product_name }}</span>
				</div>
				<div class="g-flex g-fw-w" style="width:910px">
					<oa-info-item label="补交成本" >
						<oa-money-tooltip :total="supply.cost_amount" :data="supply.cost_amount_detail" />
					</oa-info-item>
				</div>
			</div>
		</template>
	</div>
</template>
<script >
import MoneyTooltip from '@components/sale/_common/customer/popup/components/money-tooltip';
import InfoItem from '../../../../info-item';

export default {
	name: "oa-sale-customer-supply-info",
	components: {
		'oa-info-item': InfoItem,
		'oa-money-tooltip': MoneyTooltip
	},
	props: {
		supplyId: Number,
	},
	data() {
		return {
			loading: false,
			supplyInfo: {// 补款信息
				payment_amount: "", // 补款金额 
				total_cost_amount: "", // 总补交成本  缺少弹窗等李元昊
				commission_performance: '', // 提成业绩
				service_amount: ""// 服务提成
			},
			projectInfo: [// 产品信息
				// {
				// 	"record_id": 5020,
				// 	"project_id": 3832,
				// 	"supply_id": 3946,
				// 	"cost_amount": "0.00", // 补交成本
				// 	"product_name": "代理内训（成交型内训）"// 产品名称
				// }
			],
			financeAudit: {// 审核信息
				audit_staff_id: '',
				audit_remark: "", // 审核说明
				status: 1,
				status_name: "", // 审核状态
				remark_explain: "",
				audit_time: "", // 审核时间
				audit_staff_name: "", // 审核人
			}
			
		};
	},
	computed: {
	},
	watch: {
		supplyId() {
			this.loadData();
		},
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loadSupplyInfo();
		},
		loadSupplyInfo() {
			this.loading = true;
			this.$request({
				url: "_SALE_SUPPLEMENT_INFO_GET",
				type: "GET",
				param: {
					supply_id: this.supplyId
				},
				loading: false,
			}).then(res => {
				this.loading = false;
				this.supplyInfo = res.data.supply_info;
				this.projectInfo = res.data.project_info;
				this.financeAudit = res.data.finance_audit;
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