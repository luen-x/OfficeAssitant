<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-collage-cooperate-detail"
		@on-close="handleCancel"
	>
		<oa-head :company_information="company_information"/>

		<i-tabs
			v-if="detailShow"
			:value="tabs"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane label="项目需求" name="projectRequirement">
				<keep-alive>
					<oa-project-requirement
						v-show="tabs === 'projectRequirement'"
						ref="project"
						:type="type"
						:project_id="project_id"
						:contract_id="contract_id"
						name ="cooperate"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="客户信息" name="customerInformation">
				<keep-alive>
					<oa-customer-information
						v-show="tabs === 'customerInformation'"
						ref="customer"
						:contract_id="contract_id"
						:project_id="project_id"
						:contract_type="contract_type"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="补款记录" name="supplementRecord">
				<keep-alive>
					<oa-supplement-record
						v-if="tabs === 'supplementRecord'"
						:contract_id="contract_id"
						:project_id="project_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="交付表" name="deliveryTable">
				<keep-alive>
					<oa-delivery-table
						v-if="tabs === 'deliveryTable'"
						:project_id="project_id"
						:lesson_type="lesson_type"
						:type="type"
						name="cooperate"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="其他合同" name="returnRcords">
				<keep-alive>
					<oa-other-contract
						v-if="tabs === 'returnRcords'"
						:contract_id="contract_id"
						name="cooperate"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>

		<div v-if="showFooter" class="_footer">
			<i-button
				v-if="type === '1' && $auth[118]"
				style="margin-right: 8px"
				type="primary"
				@click="handleOpenAudit('1')"
			>
				通过申请
			</i-button>
			<i-button
				v-if="type === '1' && $auth[119]"
				style="margin-right: 8px;height: 32px;"
				@click="handleOpenAudit('2')"
			>
				驳回申请
			</i-button>
			<i-button
				v-if="type === '1' && $auth[120]"
				style="margin-right: 8px;height: 32px;"
				@click="handleModifyCost"
			>
				修改成本
			</i-button>
			<i-button
				v-if="type === '3' && $auth[121]"
				style="margin-right: 8px;height: 32px;"
				type="primary"
				@click="handleDistribution"
			>
				分配
			</i-button>
			<i-button
				v-if="type === '4' && $auth[122]"
				style="margin-right: 8px;height: 32px;"
				type="primary"
				@click="handleDistribution"
			>
				重新分配
			</i-button>
			<i-button
				v-if="type !== '5' && type !== '6' && $auth[642]"
				style="margin-right: 8px;height: 32px;"
				@click="handleModifyCus"
			>
				更改下单信息
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
import { ModifyCostModal } from "./modify-cost";
import { DistributionModal } from "../../_common/detail/distribution/distribution";
import Head from "../../_common/detail/head/head";
import { ModifyCusInformationModal } from "../../_common/detail/customer/modify-cus-information";
import CustomerInformation from "../../_common/detail/customer/customer-information";
import ProjectRequirement from "../../_common/detail/project-requirement/project-requirement";
import SupplementRecord from "../../_common/detail/supplement-record/supplement-record";
import DeliveryTable from "../../_common/detail/delivery-table/delivery-table";
import OtherContract from "../../../sc/_common/detail/other-contract/other-contract";

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
		"oa-customer-information": CustomerInformation,
		"oa-project-requirement": ProjectRequirement,
		"oa-supplement-record": SupplementRecord,
		"oa-head": Head,
		"oa-delivery-table": DeliveryTable,
		"oa-other-contract": OtherContract
	},

	props: {
		type: String,
		project_id: Number,
		contract_id: Number,
		contract_company_id: Number,
		lesson_type: Number, // 1 表示线上 2表示线下
		is_cost_instalment: Number,
		contract_type: Number
	},

	data() {
		return {
			closable: false,
			tabs: "",
			company_information: {},
			detailShow: true
		};
	},

	computed: {
		showFooter() {
			if (this.type === "5" || this.type === "6") {
				return false;
			} else if (this.type === "1" && !this.$auth[118] && !this.$auth[119] && !this.$auth[1031]) {
				return false;
			} else if (this.type === "2" && !this.$auth[1031]) {
				return false;
			} else if (this.type === "3" && !this.$auth[1031] && !$auth[121]) {
				return false;
			} else if (this.type === "4" && !this.$auth[1031] && !$auth[122]) {
				return false;
			}

			return true;
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
				this.tabs = "projectRequirement";
			});

			this.loadHeadData();
		},

		loadHeadData() {
			this.$request({
				url: API_ROOT._SALE_CONTRACT_DETAIL_GET,
				type: "GET",
				param: {
					contract_id: this.contract_id
				},
				loading: false
			}).then(res => {
				this.company_information = res.data;
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
				project_id: this.project_id,
				contract_id: this.contract_id
			}).then(res => {
				if (res) {
					this.handleCancel();
					this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_LIST_RESET', {
						type: 1
					});
				}
			});
		},

		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		},

		// 修改成本
		handleModifyCost() {
			let need_cost_amount = +this.$refs.project.project_data.project[0].need_cost_amount;
			let cost_amount = +this.$refs.project.project_data.project[0].cost_amount;

			ModifyCostModal.popup({
				project_id: this.project_id,
				contract_id: this.contract_id,
				need_cost_amount,
				cost_amount,
				is_cost_instalment: this.is_cost_instalment
			}).then(res => {
				if (res) {
					this.$refs.project.loadData();
					this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_LIST_RESET', {
						type: ""
					});
				}
			});
		},

		// 更改下单信息
		handleModifyCus() {
			ModifyCusInformationModal.popup({
				contract_id: this.contract_id,
				project_id: this.project_id,
				type: this.type
			}).then(res => {
				if (res) {
					this.loadHeadData();
					this.$refs.customer.loadData();
					this.$refs.project.loadData();

					this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_LIST_RESET', {
						type: this.type
					});
				}
			});
		},

		// 分配
		handleDistribution() {
			DistributionModal.popup({
				project_id: this.project_id
			}).then(res => {
				res && this.handleCancel();
			});
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-collage-cooperate-detail {
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

		.ivu-tabs-tab {
			padding: 6px 0;
			margin: 0 15px;
		}

		.ivu-tabs-tab:hover {
			color: #e84854;
		}

		.ivu-tabs-ink-bar {
			display: none;
		}

		.ivu-tabs-nav-scroll {
			background: #f5f5f6;
			border-bottom: 2px solid #d4d7db;
		}

		.ivu-tabs-tab-focused,
		.ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
			color: #e74854;
			border-color: #e74854!important;
			border-bottom: 2px #e74854 solid !important;
		}

		.ivu-tabs-nav .ivu-tabs-tab-active {
			color: #e84854;
		}
		
		.ivu-tabs-bar{
			margin-bottom: 0px;
		}
	}
}
</style>