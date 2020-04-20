<template>
	<div class="v-sc-customer-supplement-record g-m-l-20 g-m-t-30 g-relative">
		<div v-if="spin">
			<div v-if="record_data.length != 0">
				<oa-steps
					:data-source="record_data"
					:type="1"
					:render-title="renderTitle"
					:render-content="renderContent"
				/>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Spin } from "iview";
import API_ROOT from "@stores/apis/root";
import Steps from "@components/_common/steps/steps";

export default {
	name: "sc-customer-supplement-record",

	components: {
		"oa-steps": Steps,
		"i-spin": Spin
	},

	props: {
		project_id: Number,
		contract_id: Number
	},

	data() {
		return {
			record_data: [],
			spin: false
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.spin = false;

			this.$request({
				url: "_SALE_CONTRACT_SUPPLEMENT_LIST_GET",
				type: "GET",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				this.record_data = res.data;

				if (this.record_data.length == 1) {
					this.record_data.unshift({
						is_single: 1,
						content: "暂无补款记录"
					});
				}

				this.spin = true;
			}).catch(error => {
				this.spin = true;
			});
		},

		renderTitle(h, params) {
			const { is_single, type, create_time, content, payment_amount, staff_name, cost_amount } = params.rows;

			if (is_single) {
				return (
					<div class="g-m-l-10" style="margin-top: 3px;">
						{content}
					</div>
				);
			} else if (type == 2) {
				return (
					<div style="margin-top: 2px;">
						<span class="g-m-r-20">{create_time}</span>
						<span class="g-m-r-20 g-c-black">下单</span>
						<span class="g-m-r-20 g-c-black">实付金额：{payment_amount}</span>
						<span class="g-c-black">{staff_name}</span>
					</div>
				);
			} else {
				return (
					<div>
						<span class="g-m-r-20">{create_time}</span>
						<span class="g-m-r-20 g-c-black">补交尾款</span>
						<span class="g-m-r-20 g-c-black">补款金额：{payment_amount}</span>
						<span class="g-c-black">补款成本：{cost_amount}</span>
					</div>
				);
			}
		},

		renderContent(h, params) {
			const { is_single, detail, type, payment_amount } = params.rows;

			if (is_single) {
				return <div class="g-m-b-20"/>;
			} else {
				return (
					<div class="g-m-b-20 g-m-t-5 g-c-black">
						{
							detail.map(item => {
								return (
									<span>
										{'【' + item.product_name + '】'}
										{	
											item.cost_amount != '0.00' && <span class="g-m-l-10">
												{ type == 2 && '实扣成本' }：{ item.cost_amount } 
											</span>	
										}
									</span>
								); 
							})
						}
					</div>
				);
			}
		}
	}
};
</script>

<style lang="scss">
.v-sc-customer-supplement-record {
    min-height: 300px;
}
</style>