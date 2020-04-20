<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-sc-customer-predistribute-detail"
		@on-close="handleCancel"
	>
		<oa-head 
			:contract_company_id="contract_company_id" 
			:customer_base_info="customer_base_info"
			:data="data"
		/>

		<i-tabs
			v-if="detailShow"
			:value="tabs"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane label="下单信息" name="customer">
				<keep-alive>
					<oa-customer 
						v-if="tabs === 'customer'" 
						ref="customer"
						:contract_company_id="contract_company_id"
						:data="data"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="课程记录" name="courseRecords">
				<keep-alive>
					<oa-course-records
						v-if="tabs === 'courseRecords'"
						ref="courseRecords"
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="质检记录" name="checkRecords">
				<keep-alive>
					<oa-check-records
						v-if="tabs === 'checkRecords'"
						ref="checkRecords"
						:contract_company_id="contract_company_id"
						:flag="2"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="投诉记录" name="serviceManageComplaint">
				<keep-alive>
					<oa-service-manage-complaint 
						v-if="tabs === 'serviceManageComplaint'" 
						ref="complaint"
						:contract_company_id="contract_company_id"
						:name="name"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane v-if="$auth[1356]" label="通话记录" name="callHistory">
				<keep-alive>
					<oa-call-history 
						v-if="tabs === 'callHistory'"
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>

		<div 
			v-if="tabs == 'customer' || tabs == 'serviceManageComplaint' || tabs == 'courseRecords'"
			class="_footer"
		>

			<i-button 
				v-if="tabs === 'customer' && $auth[1348]" 
				type="primary"
				style="margin-right: 8px" 
				@click="handleAddContract"
			>
				添加联系方式
			</i-button>

			<i-button 
				v-if="tabs === 'courseRecords' && $auth[1351]" 
				type="primary"
				style="margin-right: 8px" 
				@click="handleAddRecords"
			>
				添加质检记录
			</i-button>

			<i-button 
				v-if="tabs === 'serviceManageComplaint' && $auth[1353]" 
				type="primary"
				style="margin-right: 8px" 
				@click="handleAddEditComplaint"
			>
				添加投诉
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Head from "./head";
import Customer from "./customer";
import ServiceManageComplaint from "./service-manage-complaint";
import CallHistory from "./call-history";
import CheckRecords from "./check-records.vue";
import CourseRecords from "./course-records.vue";
// import { ReturnsModal } from "../../service-manage/modal/returns";
import { AddEditComplaintModal } from "./add-edit-complaint-modal";
import { ContractModal } from "./contract-modal";
import { RecordsModal } from "./check-records-modal.vue";

export default {
	name: "sc-service-manage-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-head": Head,
		"oa-customer": Customer,
		"oa-service-manage-complaint": ServiceManageComplaint,
		"oa-call-history": CallHistory,
		"oa-check-records": CheckRecords,
		"oa-course-records": CourseRecords
	},

	props: {
		type: String,
		quality_id: Number,
		contract_company_id: Number,
		flag: Number,
		name: String,
		data: Object
	},

	data() {
		return {
			closable: false,
			show: false,
			detailShow: true,
			tabs: this.name || "",
			customer_base_info: {
				brand_name: '',
				depart_manage: ''
			}
		};
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
				this.tabs = this.tabs || "customer";
			});

			this.loadHeadData();
		},

		handleCancel() {
			this.$emit("close");
		},
        
		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name + '';
		},

		// 头部信息
		loadHeadData() {
			this.$request({
				url: API_ROOT._COLLAGE_CHECK_STATISTIC_QUALITY_COMPANY_INFO_LIST_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.customer_base_info = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 添加联系人
		handleAddContract() {
			ContractModal.popup({
				name: "add",
				contract_company_id: this.contract_company_id
			}).then(res => {
				this.$refs.customer.loadListData();
			});
		},

		// 添加投诉记录
		handleAddEditComplaint() {
			AddEditComplaintModal.popup({
				contract_company_id: this.contract_company_id,
				name: "add"
			}).then(res => {
				res && this.$refs.complaint.loadData();
			});
		},

		// 添加质检记录
		handleAddRecords() {
			let lessonData = this.$refs.courseRecords.lessonList;
			let checked = lessonData.map(v => v.checked).includes(true);
			let checkedData = lessonData.filter(v => v.checked);
			checkedData.forEach((v, index) => {
				v.type = (index + 1) + '';
				v.isAdd = v.whole_score ? 1 : 0;
				// v.whole_score = null;
			});
			checked ? RecordsModal.popup({
				contract_company_id: this.contract_company_id,
				edit: 0,
				datas: checkedData,
				quality_id: this.quality_id
			}).then(res => {
				this.tabs = 'checkRecords';
				this.$refs.courseRecords.loadData();
				this.$nextTick(() => {
					this.$refs.checkRecords.loadData();
				});
				this.$store.commit('COLLAGE_CHECK_SERVICE_LIST_INIT');
			}) : this.$Message.warning('请选择要质检的课程');
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-predistribute-detail {
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
}
</style>