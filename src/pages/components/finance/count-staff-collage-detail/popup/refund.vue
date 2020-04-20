<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>查看详情</div>
		<div class="v-finance-refund-modal">
			<oa-auto-tooltip
				:content="refundData.contract_company_name"
				width="200px"
				theme="dark"
				class="auto-tooltip"
				placement="top-start"
			/>
			<h3 class="g-m-t-20"><i />退款信息</h3>
			<div class="g-m-l-15">
				<i-row>
					<i-col
						span="12"
						class="g-m-t-10"
					>
						<span>退款金额</span><span class="g-m-l-20">{{ refundData.refund_info.refund_amount }}</span>
					</i-col>
					<i-col
						span="12"
						class="g-m-t-10"
					>
						<div class="g-flex">
							<span style="width:70px">退款产品</span>
							<oa-auto-tooltip
								:content="refundData.refund_info.refund_product_name"
								width="180px"
								theme="dark"
								class="g-m-l-20"
								placement="bottom"
							/>
						</div>
					</i-col>
					<i-col
						span="12"
						class="g-m-t-10"
					>
						<span>退还成本</span><span class="g-m-l-20">{{ refundData.refund_info.all_return_cost_amount }}</span>
					</i-col>
					<i-col
						span="12"
						class="g-m-t-10"
					>
						<span>退款种类</span><span class="g-m-l-20">{{ refundData.refund_info.refund_mode_name }}</span>
					</i-col>
					<i-col
						span="12"
						class="g-m-t-10"
					>
						<span>换后产品</span><span class="g-m-l-20">{{ refundData.refund_info.after_product_name }}</span>
					</i-col>
					<i-col
						span="12"
						class="g-m-t-10"
					>
						<div class="g-flex">
							<span style="width:70px">退款理由</span>
							<oa-auto-tooltip
								:content="refundData.refund_info.remark"
								width="180px"
								theme="dark"
								placement="bottom"
							/>
						</div>
					</i-col>
				</i-row>
			</div>

			<h3 class="g-m-t-20"><i />产品信息</h3>
			<div
				v-for="(item,index) in refundData.refund_project"
				:key="index"
			>
				<div class="_product g-m-t-20 g-m-l-15">{{ item.product_name }}</div>
				<div class="_item">
					<div class="_title g-m-l-15">退还成本</div>
					<span class="g-m-l-20">{{ item.return_cost_amount }}</span>
					<!-- <i-tooltip
						max-width="200"
						placement="top"
						v-if='refundData.payment_time.length>=2'
					>
						<span class='g-m-l-20'>{{item.return_cost_amount}}</span>
						<div slot="content">
							<div
								v-for='(i,ix) in refundData.payment_time'
								:key='ix'
							>
								<div>{{item.return_cost_amount}}</div>
							</div>
						</div>
					</i-tooltip> -->
				</div>
			</div>
			<i-row>
				<i-col
					span="12"
					class="g-m-t-10 g-m-l-20"
				>
					<span>应扣回提成：</span><span class="g-m-l-20">{{ refundData.deduction_commission }}</span>
				</i-col>
			</i-row>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Row, Col, Tooltip } from "iview";
import { CreatePortal } from "wya-vc";
import API from "@stores/apis/root";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	name: "finance-count-staff-modal",
	components: {
		"i-modal": Modal,
		"i-tooltip": Tooltip,
		"i-row": Row,
		"i-col": Col,
		"oa-auto-tooltip": AutoToolTip
	},
	props: {
		refund_id: Number
	},
	data() {
		return {
			visible: false,
			refundData: {
				real_refund_amount: 0, // 退款金额
				contract_company_name: "", // 公司名称
				refund_mode_name: "", // 退款方式名称
				remark: "" // 退款理由
			}
		};
	},
	computed: {},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {
			this.$request({
				url: API._FINANCE_COUNT_STAFF_COMMISSION_GET_REFUND_DETAIL_GET,
				type: "GET",
				param: {
					refund_id: 1259 || this.refund_id
				}
			})
				.then(res => {
					this.refundData = res.data;
				})
				.catch(err => {});
		},
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			// this.$emit("close");
		}
	}
};

export const RefundModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-finance-refund-modal {
	padding: 20px;
	.auto-tooltip {
		font-size: 14px;
		color: #4b4f57;
	}
	h3 {
		color: #000;
		font-size: 14px;
		margin-left: 0px;
		i {
			display: inline-block;
			background-color: #e84c57;
			margin-right: 10px;
			padding-top: 4px;
			vertical-align: middle;
			width: 2px;
			height: 14px;
		}
	}
	._product {
		color: #4b4f57;
		font-weight: bold;
	}
	._title {
		color: #4b4f57;
	}
	._item {
		padding: 20px 0;
		border-bottom: 1px solid #ebeef1;
		display: flex;
		align-items: center;
	}
}
</style>


