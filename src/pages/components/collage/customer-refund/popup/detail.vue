<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-collage-refund-detail"
		@on-close="handleCancel"
	>
		<div class="g-relative g-pd-b-5">
			<div class="g-c-black g-fs-16 g-pd-15 g-flex">
				<p>
					{{ company_information.contract_company_name }}
					<span class="g-fs-14">（合同编号：{{ company_information.contract_num }}）</span>
				</p>
			</div>

			<div class="g-m-l-15 g-flex">
				<p class="g-fs-12 g-m-b-10 g-1of4">
					<span class="g-c-black4">客户姓名：</span>
					<oa-detail :content="company_information.customer_name"/>
				</p>

				<p class="g-fs-12 g-m-b-10 g-1of4">
					<span class="g-c-black4">客户手机号：</span>
					<oa-detail :content="company_information.phone"/>
				</p>

				<p class="g-fs-12 g-m-b-10 g-1of4">
					<span class="g-c-black4">退款类型：</span>
					<oa-detail :content="['产品退款','换产品退款','余额退款'][company_information.refund_type * 1 - 1]"/>
				</p>

				<p class="g-fs-12 g-m-b-10 g-1of4">
					<span class="g-c-black4">邀约人：</span>
					<oa-detail :content="company_information.invite_staff_name"/>
				</p>
			</div>
		</div>

		<i-tabs v-if="detailShow" :value="tabs" @on-click="handleSwitchTabs">
			<i-tab-pane label="退款信息" name="refund">
				<keep-alive>
					<oa-exchange-product
						v-if="tabs === 'refund'"
						:refund_id="refund_id"
						:type="type"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="项目需求" name="projectRequirement">
				<keep-alive>
					<oa-project-requirement
						v-if="tabs === 'projectRequirement'"
						:type="type"
						:contract_id="contract_id"
						name="refund"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>

		<div v-if="showFooter" class="_footer">
			<i-button
				v-if="type === '1' && $auth[123]"
				style="margin-right: 8px"
				type="primary"
				@click="handleOpenAudit('1')"
			>
				通过申请
			</i-button>
			<i-button
				v-if="type === '1' && $auth[124]"
				style="margin-right: 8px;height: 32px;"
				@click="handleOpenAudit('0')"
			>
				驳回申请
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane, Spin } from "iview";
import { CreatePortal } from "wya-vc";
import { DetailItem, Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import { AuditModal } from "./audit";
import ExchangeProduct from "./exchange-product";
import ProjectRequirement from "../../_common/detail/project-requirement/project-requirement";
import Detail from "../../_common/detail-item";

export default {
	name: "collage-customer-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"oa-title": Title,
		"i-button": Button,
		"oa-detail-item": DetailItem,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-spin": Spin,
		"oa-exchange-product": ExchangeProduct,
		"oa-project-requirement": ProjectRequirement,
		"oa-detail": Detail
	},

	props: {
		type: String,
		refund_id: Number,
		contract_id: Number
	},

	data() {
		return {
			company_information: {},
			closable: false,
			tabs: "refund",
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
				this.tabs = "refund";
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

		handleOpenAudit(name) {
			AuditModal.popup({
				name,
				refund_id: this.refund_id
			}).then(res => {
				if (res) {
					this.handleCancel();

					this.$store.commit('COLLAGE_CUSTOMER_REFUND_LIST_RESET', {
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
.v-collage-refund-detail {
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

    .ivu-drawer-body {
		padding: 0px;
		overflow-y: hidden;

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
		.ivu-tabs-bar{
			margin-bottom: 0px;
		}
	}
}
</style>