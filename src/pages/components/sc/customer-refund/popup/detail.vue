<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-sc-refund-detail"
		@on-close="handleCancel"
	>
		<div class="g-relative g-pd-b-5">
			<div class="g-c-black g-fs-16 g-pd-15 g-flex">
				<p @mouseenter="show=true" @mouseleave="show=false">
					{{ company_information.contract_company_name }}
					<span
						v-if="company_information.refund_type != 3" 
						class="g-fs-14"
					>
						（合同编号：{{ company_information.contract_num }}）
					</span>
				</p>
			</div>

			<ul class="g-flex g-fs-12 g-pd-b-15">
				<li class="g-1of4">
					<p>
						<span class="g-c-black4">客户姓名：</span>
						<oa-item :content="company_information.customer_name"/>
					</p>
				</li>
				<li class="g-1of4">
					<p>
						<span class="g-c-black4">客户手机号：</span>
						<oa-item :content="company_information.phone"/>
					</p>
				</li>
				<li v-if="company_information.refund_type != 3" class="g-1of4">
					<p>
						<span class="g-c-black4">退款类型：</span>
						<oa-item :content="['产品退款','换产品退款','余额退款'][company_information.refund_type * 1 - 1]"/>
					</p>
				</li>
				<li class="g-1of4">
					<p>
						<span class="g-c-black4">邀约人：</span>
						<oa-item :content="company_information.invite_staff_name"/>
					</p>
				</li>
			</ul>
		</div>

		<i-tabs v-if="detailShow" :value="tabs" @on-click="handleSwitchTabs">
			<i-tab-pane
				label="退款信息"
				name="paymentInformation"
			>
				<keep-alive>
					<oa-payment-information
						v-if="tabs === 'paymentInformation'"
						:refund_id="refund_id"
						:type="type"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane
				v-if="refund_type === 1"
				label="项目需求"
				name="projectRequirement"
			>
				<keep-alive>
					<oa-project-requirement
						v-if="tabs === 'projectRequirement'"
						:type="type"
						:contract_id="contract_id"
						name="refund"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane
				label="到账记录"
				name="paymentRecord"
			>
				<keep-alive>
					<oa-payment-record 
						v-if="tabs === 'paymentRecord'" 
						:contract-company-id="contract_company_id" 
						class="g-m-l-20"
						style="width:860px"
					/>
				</keep-alive>
			</i-tab-pane>

		</i-tabs>

		<div
			v-if="showFooter"
			class="_footer"
			style="padding: 13.5px 16px;"
		>
			<i-button
				v-if="type === '1' && $auth[353]"
				style="margin-right: 8px"
				type="primary"
				@click="handleOpenAudit('1',refund_id)"
			>
				通过申请
			</i-button>
			<i-button
				v-if="type === '1' && $auth[321]"
				style="margin-right: 8px"
				@click="handleOpenAudit('0',refund_id)"
			>
				驳回申请
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane, Spin } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import PaymentRecord from '@components/sale/_common/customer/popup/refund-detail/parts/payment-record.vue';
import { AuditModal } from "./audit";
import PaymentInformation from "./payment-information";
import ProjectRequirement from "../../_common/detail/project-requirement/project-requirement";
import Item from "../../_common/detail/head/item";


export default {
	name: "sc-refund-detail",

	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-spin": Spin,
		"oa-payment-information": PaymentInformation,
		"oa-project-requirement": ProjectRequirement,
		'oa-payment-record': PaymentRecord,
		'oa-item': Item
	},

	props: {
		type: String,
		contract_id: Number,
		refund_id: Number,
		contract_company_id: Number,
		refund_type: Number
	},

	data() {
		return {
			company_information: {},
			closable: false,
			tabs: "paymentInformation",
			show: false,
			detailShow: true
		};
	},

	computed: {
		showFooter() {
			if (this.type === "1") {
				return true;
			} else {
				return false;
			}
		}
	},

	mounted() {
		this.loadData();
		this.closable = true;
	},

	methods: {
		loadData() {
			this.detailShow = false;

			this.$nextTick(() => {
				this.detailShow = true;
				this.tabs = "paymentInformation";
			});

		
			this.$request({
				url: API_ROOT._SAEL_REFUND_DETAIL_GET,
				type: "GET",
				param: {
					refund_id: this.refund_id
				},
				loading: false
			}).then(res => {
				this.company_information = res.data.base_info;
			}).catch(error => {});
		},

		handleOk() {
			this.$emit("sure");
		},

		handleCancel() {
			this.$emit("close");
		},

		handleOpenAudit(name, refund_id) {
			AuditModal.popup({
				name,
				refund_id
			}).then(res => {
				if (res) {
					this.handleCancel();

					this.$store.commit('SC_CUSTOMER_REFUND_LIST_RESET', {
						type: 1
					});
				}
			});
		},

		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-sc-refund-detail {
	.ivu-tabs{
		height: calc(100% - 190px);
		
		.ivu-tabs-tabpane{
			overflow-x: hidden;
			overflow-y: auto;
			max-height: 100%;
		}

		.ivu-tabs-content{
			height: calc(100% - 34px);
		}
	}

    ul {
        padding: 0 16px 5px 16px;

        li {
            list-style: none;
        }
    }

    .ivu-drawer-body {
		padding: 0px;

		.ivu-tabs-nav .ivu-tabs-tab-active {
			color: #e84854;
		}
		.ivu-tabs-tab:hover {
			color: #e84854;
		}
		.ivu-tabs-ink-bar {
			background: #e84854;
			bottom: 0;
		}
		.ivu-tabs-nav-scroll {
			background: #f5f5f6;
			border-bottom: 2px solid #d4d7db;
		}
		.ivu-tabs-ink-bar {
			width: 58px !important;
			left: 15px !important;
		}
		.ivu-tabs-bar{
			margin-bottom: 0px;
		}
	}

	._footer {
		width: 940px;
		position: fixed;
		bottom: 0;
		right: 0;
		border-top: 1px solid #e8e8e8;
		padding: 13.5px 16px;
		text-align: left;
		background: #fff;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
	}
	._product-label {
		position: absolute;
		right: 0;
		margin-right: 20px;
		margin-top: 20px;
		top: 32px;
	}
	.v-sale-refund-payment-record .c-components-common-expand-panel .v-sale-customer-info-item {
		width: 320px;
		margin: 15px 75px 5px 0px;
	}
}
</style>