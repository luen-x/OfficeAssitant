<template>
	<i-drawer 
		v-model="visible" 
		:mask="false"
		:mask-closable="false"
		class="v-sale-train-employee-detail"
		@on-close="handleCancel"
	>
		<oa-train-employee-detail-head
			:staff-id="staffId"
			:applicant-id="applicantId"
			@close="handleCancel"
		/>
		<i-tabs
			:style="'height:calc(100% - 220px)'"
			value="orientation"
			@on-click="handleChangeTab"
		>
			<i-tab-pane 
				label="岗前培训" 
				name="orientation" 
				class="_detail-content"
			>
				<keep-alive>
					<oa-train-employee-orientation 
						v-if="tabs == 'orientation'"
						:staff-id="staffId"
						:applicant-id="applicantId"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane 
				label="人才计划" 
				name="brain" 
				class="_detail-content"
			>
				<keep-alive>
					<oa-train-employee-brain 
						v-if="tabs == 'brain'"
						:staff-id="staffId"
						:applicant-id="applicantId"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane 
				label="其他项目" 
				name="other"
				class="_detail-content"
			>
				<keep-alive>
					<oa-train-employee-other 
						v-if="tabs == 'other'"
						:staff-id="staffId"
						:applicant-id="applicantId"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane 
				label="自学课程" 
				name="selfStudy"
				class="_detail-content"
			>
				<keep-alive>
					<oa-train-employee-self-study 
						v-if="tabs == 'selfStudy'"
						:staff-id="staffId"
						:applicant-id="applicantId"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>
	</i-drawer>
</template>

<script>
import { Drawer, Tabs, TabPane } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import orderModal from '@extends/mixins/orderModal';
import { TrainEmployeeDetailHead } from "./detail-head";
import { TrainEmployeeOrientation } from "./orientation";
import { TrainEmployeeBrain } from "./brain";
import { TrainEmployeeOther } from './other';
import { TrainEmployeeSelfStudy } from './self-study';

export default {
	name: "oa-train-employee-detail",
	components: {
		'i-drawer': Drawer,
		'oa-train-employee-detail-head': TrainEmployeeDetailHead,
		'oa-train-employee-orientation': TrainEmployeeOrientation,
		'oa-train-employee-brain': TrainEmployeeBrain,
		'oa-train-employee-other': TrainEmployeeOther,
		'oa-train-employee-self-study': TrainEmployeeSelfStudy,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane
	},
	mixins: [orderModal],
	props: {
		staffId: [String, Number],
		applicantId: [String, Number],
	},
	data() {
		return {
			visible: false,
			tabs: 'orientation'
		};
	},
	mounted() {
		this.visible = true;
	},
	destroyed() {
		this.handleCancel();
	},
	methods: {
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 切换tab
		 */
		handleChangeTab(name) {
			this.tabs = name;
		}
	}
};

export const TrainEmployeeDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss">
.v-sale-train-employee-detail {
	._detail-content {
		padding: 0 16px;
	}
	.ivu-drawer.ivu-drawer-right {
		width: 720px !important;
	}
	.ivu-tabs-tab {
		padding: 6px 0;
		margin: 0 15px;
	}
	.ivu-drawer-body {
		padding: 0;
	}
	.ivu-tabs-bar {
		background-color:#f6f6f6;
		margin-bottom: 0;
	}
	.ivu-tabs-tab:hover {
		color: #e84854;
	}
	.ivu-tabs-nav .ivu-tabs-tab-active {
		color: #e84854;
	}
	.ivu-tabs-ink-bar {
		background-color:#e84854;
		display: none;
	}
	.ivu-tabs-tab-focused,
	.ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
		color: #e74854;
		border-color: #e74854!important;
		border-bottom: 3px #e74854 solid !important;
	}
	.ivu-tabs-tabpane {
		overflow-y: overlay;
		overflow-x: hidden;
		max-height: 100%;
	}
	.ivu-tabs-content {
		height: calc(100% - 30px);
	}
}
</style>
