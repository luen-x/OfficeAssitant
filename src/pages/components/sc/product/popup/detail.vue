<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-sc-product-detail"
		@on-close="handleCancel"
	>
		<oa-head
			:company_information="company_information"
			:type="type"
			:flag="2"
		/>

		<i-tabs
			v-if="detailShow"
			:value="tabs"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane label="项目需求" name="projectRequirement">
				<keep-alive>
					<oa-project-requirement
						v-if="tabs === 'projectRequirement'"
						ref="project"
						:type="type"
						:project_id="project_id"
						:contract_id="contract_id"
						name="product"
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
			<i-tab-pane label="制作分配" name="productDistribut">
				<keep-alive>
					<oa-product-distribut
						v-if="tabs === 'productDistribut'"
						ref="distrubute"
						:contract_id="contract_id"
						:project_id="project_id"
						:product_id="product_id"
						:product="product"
						:type="type"
						name="product"
						@event="handleAllocatProduct"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="制作进度" name="productProgress">
				<keep-alive>
					<oa-product-progress
						v-if="tabs === 'productProgress'"
						:project_id="project_id"
						:type="type"
						flag="2"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane
				label="服务凭证"
				name="serviceVoucher"
			>
				<keep-alive>
					<oa-service-voucher
						v-if="tabs === 'serviceVoucher'"
						:project_id="project_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="交接完成表" name="deliveryTable">
				<keep-alive>
					<oa-delivery-table
						v-if="tabs === 'deliveryTable'"
						ref="delivery"
						:contract_id="contract_id"
						:project_id="project_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane name="otherContract" label="其他合同">
				<keep-alive>
					<oa-other-contract 
						v-if="tabs === 'otherContract'"
						:contract_id="Number(contract_id)"
						name="product"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="回访记录" name="returnRcords">
				<keep-alive>
					<oa-return-record
						v-if="tabs === 'returnRcords'"
						ref="returnRecord"
						:contract_company_id="contract_company_id"
						name="name"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>

		<div v-if="showFooter" class="_footer">
			<i-button
				v-if="tabs === 'customerInformation' && $auth[328]"
				type="primary"
				@click="handleOpenEdit"
			>
				添加对接人信息
			</i-button>
			<i-button
				v-if="(type === '1' || type === '2') && tabs === 'projectRequirement' && $auth[1272]"
				type="primary"
				@click="handleModifyCus"
			>
				更改下单信息
			</i-button>

			<i-button
				v-if="(type === '1' || type === '2') && tabs === 'productDistribut' && $auth[690]"
				style="margin-right: 8px"
				type="primary"
				@click="handleAllocatProduct"
			>
				分配制作
			</i-button>

			<i-button
				v-if="type != '3' && tabs === 'productDistribut' && $auth[828]"
				@click="handleOpenWarmPrompt"
			>
				无需制作
			</i-button>

			<i-button
				v-if="tabs === 'deliveryTable'"
				type="primary"
				@click="handleUploadDeliveryForm(contract_id,project_id,1)"
			>
				上传交接表
			</i-button>
			
			<i-button
				v-if="tabs === 'deliveryTable' && $auth[313]"
				class="g-m-l-10"
				@click="handleUploadDeliveryForm(contract_id,project_id,2)"
			>
				上传项目完成表
			</i-button>

			<i-button
				v-if="tabs === 'deliveryTable'"
				class="g-m-l-10"
				@click="handleNoNeedTable(project_id)"
			>
				无需交接表
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";
import { EditModal } from "../../_common/detail/edit/edit";
import { UploadDeliveryFormModal } from "../../_common/detail/upload-delivery-form/upload-delivery-form";
import CustomerInformation from "../../_common/detail/customer/customer-information";
import ProjectRequirement from "../../_common/detail/project-requirement/project-requirement";
import SupplementRecord from "../../_common/detail/supplement-record/supplement-record";
import ProductDistribut from "../../_common/detail/product-distribut/product-distribut";
import ProductProgress from "../../_common/detail/product-progress/product-progress";
import DeliveryTable from "../../_common/detail/delivery-table/delivery-table";
import ReturnRecords from "../../_common/service-manage-detail/return-records";
import { ModifyCusInformationModal } from "../../_common/detail/customer/modify-cus-information";
import Head from "../../_common/detail/head/head";
import { AllocationProductionModal } from "../../customer-cooperate/popup/allocation-production";
import OtherContract from "../../_common/detail/other-contract/other-contract";
import ServiceVoucher from "../../_common/detail/service-voucher/service-voucher";

export default {
	name: "sc-customer-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-customer-information": CustomerInformation,
		"oa-project-requirement": ProjectRequirement,
		"oa-supplement-record": SupplementRecord,
		"oa-product-distribut": ProductDistribut,
		"oa-product-progress": ProductProgress,
		"oa-delivery-table": DeliveryTable,
		"oa-head": Head,
		"oa-return-record": ReturnRecords,
		"oa-other-contract": OtherContract,
		"oa-service-voucher": ServiceVoucher
	},

	props: {
		type: String,
		contract_id: Number,
		project_id: Number,
		product_id: Number,
		contract_company_id: Number,
		product: String,
		tab: String,
		contract_type: Number
	},

	data() {
		return {
			closable: false,
			tabs: "",
			show: false,
			company_information: {},
			detailShow: true
		};
	},

	computed: {
		showFooter() {
			if ((["supplementRecord", "productProgress", "otherContract", "returnRcords", "serviceVoucher"].indexOf(this.tabs) > -1)
			|| (this.type === "3" && this.tabs === "projectRequirement")
			|| (this.type === "3" && this.tabs === "productDistribut")) {
				return false;
			} else {
				return true;
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
				this.tab ? this.tabs = this.tab : this.tabs = "projectRequirement";
			});

			this.loadHeadData();
		},

		loadHeadData() {
			this.$request({
				url: "_SALE_CONTRACT_DETAIL_GET",
				type: "GET",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id
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

		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		},

		// 更改客户信息
		handleModifyCus() {
			ModifyCusInformationModal.popup({
				contract_id: this.contract_id,
				project_id: this.project_id
			}).then(res => {
				if (res) {
					this.loadHeadData();
					this.$refs.customer.loadData();
					this.$refs.customer.loadBuffCustomer();
					this.$refs.project.loadData();
					this.$store.commit('SC_PRODUCT_LIST_RESET', {
						type: this.type
					});
				}
			});
		},

		// 添加对接人信息
		handleOpenEdit() {
			EditModal.popup({
				contract_id: this.contract_id,
				project_id: this.project_id
			}).then(res => {
				if (res) {
					this.$refs.customer.loadData();
					this.$refs.customer.loadBuffCustomer();
				}
			});
		},

		// 上传交付表
		handleUploadDeliveryForm(contract_id, project_id, name) {
			UploadDeliveryFormModal.popup({
				contract_id,
				project_id,
				name
			}).then(res => {
				res && this.$refs.delivery.loadData();
			});
		},

		handleWarmPrompt(name) {
			Confirm.popup({
				title: "温馨提示",
				msg: name
			}).then(() => {
			}).catch(error => {});
		},

		// 分配制作
		async handleAllocatProduct() {
			if (!this.$refs.distrubute.main_person && this.$refs.distrubute.has_main_person) {
				this.handleWarmPrompt("请先选择主要负责人，在进行分配，合同才会变为已分配状态");
				return;
			}
			
			if (!this.$refs.distrubute.currentId) {
				this.handleWarmPrompt("请选择具体的项目，再进行分配操作");
				return;
			}

			AllocationProductionModal.popup({
				make_id: Number(this.$refs.distrubute.make_id),
				product_assign_id: Number(this.$refs.distrubute.product_assign_id)
			}).then(ress => {
				this.ids = [];

				ress.forEach(item => {
					this.ids.push(item.staff_id);
				});

				this.$request({
					url: API_ROOT._SC_CUSTOMER_COOPERATE_DISTRIBUTE_MAKE_POST,
					type: "POST",
					param: {
						project_id: this.project_id,
						product_assign_id: this.$refs.distrubute.currentId, 
						staff_id: this.ids.join()
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
				}).then(async () => {
					await this.$refs.distrubute.loadData();

					if (this.$refs.distrubute.count + this.$refs.distrubute.count_assign_staff == this.$refs.distrubute.assign.length) {
						this.$store.commit("SC_PRODUCT_LIST_RESET", {
							type: this.type
						});
					}
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},

		// 温馨提示
		async handleOpenWarmPrompt() {
			this.$refs.distrubute.is_dis == 0 ? this.$refs.distrubute.count-- : "";

			if (!this.$refs.distrubute.currentId) {
				this.handleWarmPrompt("请选择无需制作的产品");
				return;
			}

			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_MAKE_POST,
				type: "POST",
				param: {
					project_id: this.project_id,
					product_assign_id: this.$refs.distrubute.currentId
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(async () => {
				await this.$refs.distrubute.loadData();

				if (this.$refs.distrubute.count + this.$refs.distrubute.count_assign_staff == this.$refs.distrubute.assign.length) {
					this.$store.commit('SC_PRODUCT_LIST_RESET', {
						type: this.type
					});
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 无需交接表
		handleNoNeedTable(project_id) {
			Confirm.popup({
				title: "无需交接表",
				msg: "是否确认无需交接表 ？"
			}).then(() => {
				this.$request({
					url: '_SC_CUSTOMER_COOPERATE_MAKET_HANDOVER_POST',
					type: 'POST',
					param: {
						project_id: Number(this.project_id)
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.$refs.delivery.loadData();
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			}).catch(error => {});
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-sc-product-detail {
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