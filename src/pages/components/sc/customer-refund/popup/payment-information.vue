<template>
	<div class="v-sc-refund-payment-information">
		<div v-if="spin">
			<div class="g-flex">
				<oa-across-table :data="refund_data.audit_schedule"/>
			</div>

			<div
				v-for="(item,index) in refund_data.audit_info"
				:key="index"
				class="g-m-t-30"
			>
				<span 
					class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					{{ item.audit_depart_name }}
				</span>

				<div class="g-m-l-15 g-m-t-15">
					<oa-detail-item 
						:content="item.audit_staff_name"
						label="审核人"
					/>
					<oa-detail-item
						:content="item.audit_time" 
						label="审核时间"
					/>
					<oa-detail-item
						v-if="type != 1"
						:content="item.audit_remark" 
						:label="type == 3 && item.status == 3 ? '驳回原因' : '通过说明'"
						class="g-m-t-15"
					/>
				</div>
			</div>

			<div class="g-m-t-30">
				<span 
					class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					退款信息
				</span>

				<div class="g-m-l-15 g-m-t-15 g-flex g-fw-w">
					<div class="_block">
						<div class="g-flex">
							<span class="__label">退款金额</span>
							<i-tooltip 
								v-if="+refund_data.refund_info.status === 2 && +type === 2" 
								placement="top" 
								max-width="250"
								theme="light"
							>
								<div class="g-operation">
									{{ refund_data.refund_info.real_refund_amount }}
								</div>

								<div slot="content">
									<div v-if="+refund_data.refund_info.refund_type === 1">
										<div 
											v-for="(item,index) in refund_data.refund_info.real_refund_amount_detail"
											:key="index"
										>
											{{ item.product_name }}：{{ item.refund_amount }}
										</div>
									</div>
									<div v-else-if="+refund_data.refund_info.refund_type === 3">
										<div 
											v-for="(item,index) in refund_data.refund_info.real_refund_amount_detail"
											:key="index"
										>
											<div
												v-for="(element,i) in item.detail"
												:key="`y_${i}`"
											>
												{{ element.label }}：{{ element.value }}
											</div>
										</div>
									</div>
								</div>
							</i-tooltip>
							<div v-else>
								{{ refund_data.refund_info.real_refund_amount || '--' }}
							</div>
						</div>
					</div>

					<div v-if="+refund_data.refund_info.refund_type === 3" class="g-m-t-15 _block">
						<div class="g-flex">
							<span class="__label">退款种类</span>
							<i-tooltip
								v-if="refund_data.refund_info.refund_mode_name.length > 16"
								:content="refund_data.refund_info.refund_mode_name"
								placement="top" 
								max-width="250"
								theme="light"
							>
								<div class="g-operation">
									{{ refund_data.refund_info.refund_mode_name.slice(0,16)+ '...' }}
								</div>
							</i-tooltip>
							<div v-else>{{ refund_data.refund_info.refund_mode_name || '--' }}</div> 
						</div>
					</div>

					<div v-if="+refund_data.refund_info.refund_type === 1" class="_block">
						<div class="g-flex">
							<span class="__label">退款产品</span>
							<i-tooltip
								v-if="productName.length > 16"
								:content="productName"
								placement="top" 
								max-width="250"
								theme="light"
							>
								<div class="g-operation">
									{{ productName.slice(0,16)+ '...' }}
								</div>
							</i-tooltip>
							<div v-else>{{ productName || '--' }}</div> 
						</div>
					</div>

					<div class="g-m-t-15 _block">
						<div class="g-flex">
							<span class="__label">退款原因</span>
							<i-tooltip
								v-if="refundReason.length > 16"
								:content="refundReason"
								theme="light"
								placement="top"
								max-width="250"
							>
								<div class="g-operation">
									{{ refundReason.slice(0,16) + '...' }}
								</div>
							</i-tooltip>
							<div v-else>{{ refundReason || '--' }}</div> 
						</div>
					</div>

					<div class="g-m-t-15 _block">
						<div class="g-flex">
							<span class="__label">备注说明</span>
							<i-tooltip
								v-if="refund_data.refund_info.remark.length > 16"
								placement="top" 
								max-width="250"
								theme="light"
							>
								<div class="g-operation">
									{{ refund_data.refund_info.remark.slice(0,16)+ '...' }}
								</div>

								<div slot="content">
									{{ refund_data.refund_info.remark }}
								</div>
							</i-tooltip>
							<div v-else class="g-operation">{{ refund_data.refund_info.remark || '--' }}</div> 
						</div>
					</div>

					<div v-if="+refund_data.refund_info.refund_type === 1 && refund_data.refund_info.refund_explain_num" class="g-m-t-15 _block">
						<div class="g-flex">
							<span class="__label">补充说明</span>
							<i-tooltip
								v-if="refund_data.refund_info.refund_explain_num > 0"
								placement="top" 
								max-width="250"
								theme="light"
							>
								<div class="g-operation">
									{{ refund_data.refund_info.refund_explain_num }}
								</div>

								<div slot="content">
									<div 
										v-for="(item,index) in refund_data.refund_info.refund_explain"
										:key="`index_${index}`"
									>
										<div>{{ item.create_time }}：</div>
										<div>{{ item.staff_name }}：{{ item.explain }}</div>
									</div>
								</div>
							</i-tooltip>
							<div v-else>{{ refund_data.refund_info.refund_explain_num || '--' }}</div>
						</div>
					</div>

					<div class="g-m-t-15 _block">
						<div class="g-flex">
							<span class="__label">申请人</span>
							<i-tooltip
								v-if="refund_data.refund_info.staff_name.length > 16"
								:content="refund_data.refund_info.staff_name"
								placement="top" 
								max-width="250"
								theme="light"
							>
								<div class="g-operation">
									{{ refund_data.refund_info.staff_name.slice(0,16)+ '...' }}
								</div>
							</i-tooltip>
							<div v-else>{{ refund_data.refund_info.staff_name || '--' }}</div> 
						</div>
					</div>

					<div class="g-m-t-15 _block">
						<div class="g-flex">
							<span class="__label">申请时间</span>
							<div>{{ refund_data.refund_info.create_time || '--' }}</div> 
						</div>
					</div>

					<div 
						v-if="+refund_data.refund_info.refund_type === 1 && +refund_data.refund_info.status === 2" 
						class="g-m-t-15 _block"
					>
						<div class="g-flex">
							<span class="__label">退还成本</span>
							<i-tooltip 
								placement="top" 
								max-width="250"
								theme="light"
							>
								<div class="g-operation">
									{{ refund_data.refund_info.return_cost_amount }}
								</div>

								<div slot="content">
									<div 
										v-for="(item,index) in refund_data.refund_info.return_cost_amount_detail"
										:key="index"
									>
										{{ item.product_name }}：{{ item.return_cost_amount }}
									</div>
								</div>
							</i-tooltip>
						</div>
					</div>

					<div
						v-if="+refund_data.refund_info.refund_type === 1 && +refund_data.refund_info.status === 2" 
						class="g-m-t-15 _block"
					>
						<div class="g-flex">
							<span class="__label">退款月份</span>
							<div>{{ refund_data.refund_info.minus_month || '--' }}</div> 
						</div>
					</div>
					
					<div 
						v-if="+refund_data.refund_info.refund_type === 3 && +refund_data.refund_info.status === 2" 
						class="g-m-t-15 _block"
					>
						<div class="g-flex">
							<span class="__label">业绩扣除月份</span>
							<div>{{ refund_data.refund_info.minus_month || '--' }}</div>  
						</div>
					</div>
				</div>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Tooltip } from "iview";
import { DetailItem, Title } from "@components/sc/_common";
import AcrossTable from "@components/_common/across-table/across-table";

export default {
	name: "sc-refund-payment-information",
	components: {
		"oa-title": Title,
		"oa-detail-item": DetailItem,
		"oa-across-table": AcrossTable,
		"i-tooltip": Tooltip
	},
	props: {
		refund_id: Number,
		type: String,
		refund_type: {
			type: Number
		}
	},
	data() {
		return {
			refund_data: {},
			productName: '',
			refundReason: '',
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
				url: "_SALE_REFUND_INFO_GET",
				type: "GET",
				param: {
					refund_id: this.refund_id
				},
				loading: false
			}).then(res => {
				this.refund_data = res.data;
			
				if (this.refund_data.refund_info.refund_type) {
					this.productName = this.refund_data.refund_info.refund_project.map(item => item.product_name).join(",");
				}

				this.refundReason = this.refund_data.refund_info.refund_reason.map(item => {
					return item.reason_category_name + '-' + item.reason_list.map(element => element.reason_name).join("、");
				}).join(",");
				this.spin = true;
			}).catch(error => {
				this.spin = true;
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-refund-payment-information {
    padding-left: 32px;
	min-height: 300px;
	padding-bottom: 100px;

	._block{
		display: inline-block;
		border-bottom: 1px solid #e7e7e7;
		width: 370px;
		padding-bottom: 11px;
		margin-right: 50px;

		.__label{
			display: inline-block;
			color: #818794;
			width: 100px;
			position: relative;
			top: 0px;
		}
	}
}
</style>