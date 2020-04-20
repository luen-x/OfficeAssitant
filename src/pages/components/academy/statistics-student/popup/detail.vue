<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-academy-statistics-student-detail"
		@on-close="handleCancel"
	>
		<oa-head ref="head" :staff-id="staffId"/>

		<i-tabs
			v-if="detailShow"
			:value="tabs"
			@on-click="handleSwitchTabs"
		> 
			<i-tab-pane label="岗前培训" name="employmentTraining">
				<keep-alive>
					<oa-employment-training 
						v-if="tabs === 'employmentTraining'"
						:staff-id="staffId"
						:applicant_id="applicantId"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="三立培训" name="treeTraining">
				<keep-alive>
					<oa-train
						v-if="tabs === 'treeTraining'"
						:key="2"
						:staff-id="staffId"
						:type="2"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="三立训练" name="treeTrains">
				<keep-alive>
					<oa-train
						v-if="tabs === 'treeTrains'"
						:key="3"
						:staff-id="staffId"
						:type="3"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane } from "iview";
import { CreatePortal } from "wya-vc";
import Head from "./head";
import Train from "./train";
import EmploymentTraining from "./employment-training";

export default {
	name: "sc-customer-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-head": Head,
		"oa-train": Train,
		"oa-employment-training": EmploymentTraining
	},

	props: {
		staffId: Number,
		applicantId: Number
	},

	data() {
		return {
			closable: false,
			tabs: "",
			show: false,
			detailShow: true
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
				this.$refs.head.loadData();
				this.detailShow = true;	
				this.tabs = "employmentTraining";
			});
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
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-academy-statistics-student-detail {
	.ivu-tabs{
		height: calc(100% - 148px);
		
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