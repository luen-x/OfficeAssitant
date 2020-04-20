<template>
	<div class="v-hr-employee-detail-training">
		<oa-train-employee-detail-head class="_head"/>
		<!-- <i-tabs
			:style="tabs == 'selfStudy'?'height:calc(100% - 280px)':'height:calc(100% - 220px)'"
			value="orientation"
			name="orientationtabs"
			class="_tabs"
			@on-click="handleChangeTab"
		>
			<i-tab-pane
				label="岗前培训"
				name="orientation"
				class="_detail-content"
				tab="orientationtabs"
			>
				<keep-alive>
					<oa-train-employee-orientation
						v-if="tabs == 'orientation'"
						:staff-id="staff_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="人才计划" name="brain" class="_detail-content" tab="orientationtabs">
				<keep-alive>
					<oa-train-employee-brain v-if="tabs == 'brain'" :staff-id="staff_id"/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="其他项目" name="other" class="_detail-content" tab="orientationtabs">
				<keep-alive>
					<oa-train-employee-other v-if="tabs == 'other'" :staff-id="staff_id"/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="自学课程" name="selfStudy" class="_detail-content" tab="orientationtabs">
				<keep-alive>
					<oa-train-employee-self-study v-if="tabs == 'selfStudy'" :staff-id="staff_id"/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs> -->
	</div>
</template>

<script>
import { Drawer, Tabs, TabPane, Page } from "iview";
import API_ROOT from "@stores/apis/root";
import { CreatePortal } from "wya-vc";
// import { TrainEmployeeOrientation } from "@components/sale/train-employee/popup/orientation";
// import { TrainEmployeeBrain } from "@components/sale/train-employee/popup/brain";
// import { TrainEmployeeOther } from "@components/sale/train-employee/popup/other";
// import { TrainEmployeeSelfStudy } from "@components/sale/train-employee/popup/self-study";
// import { TrainEmployeeDetailHead } from "./head";

export default {
	name: "oa-sea-company-detail",
	components: {
		// "oa-train-employee-detail-head": TrainEmployeeDetailHead,
		// "oa-train-employee-orientation": TrainEmployeeOrientation,
		// "oa-train-employee-brain": TrainEmployeeBrain,
		// "oa-train-employee-other": TrainEmployeeOther,
		// "oa-train-employee-self-study": TrainEmployeeSelfStudy,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-page": Page
	},
	data() {
		const { query } = this.$route;
		return {
			visible: false,
			staff_id: query.staff_id,
			basicInfo: {
				echelon_name: "", // 人才梯队名称
				staff_name: "", // 姓名
				position_name: "", // 职位
				depart_name: "", // 部门
				mobile: "", // 手机
				course: {
					total_num: "", // 已参加培训总课程
					not_complete_compulsory_num: "", // 未完成必修课程
					complete_elective_num: "", // 已完成选修课程
					complete_compulsory_num: "", // 已完成必修课程
					complete_internal_num: "" // 已完成的内训课程：
				},
				total_credit: "", // 目前所得总学分
				project_num: "", // 已参加项目
				schedule: "" // 课程完成进度
			}, // 头部信息
			tabs: "orientation",
			page: 1,
			pageSize: 10,
			totalCount: 0,
			currentPage: 1
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		/**
         * 点击取消
         */
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
		/**
         * 切换tab
         */
		handleChangeTab(name) {
			this.tabs = name;
		},
		handleChange() {},
		handlePageSizeChange() {}
	}
};
</script>
<style lang="scss" >
.v-hr-employee-detail-training {
	.ivu-tabs-tabpane{
		padding-left:0px !important;
	}
    ._head {
        background-color: #f5f5f6;
        padding-top: 10px;
    }
    ._tabs {
        .ivu-tabs-nav-scroll {
            background-color: #f6f6f5;
        }
        .ivu-tabs-bar .ivu-tabs-tab {
            border-radius: 0;
            background: transparent !important;
        }
        .ivu-tabs-tab {
            margin-right: 15px !important;
        }
        .ivu-tabs-ink-bar {
            margin-left: 13px !important;
            margin-right: 1px !important;
            width: 58px !important;
            border-bottom: 3px solid #e84c57 !important;
        }
        .ivu-tabs-tabpane {
            padding-left: 16px;
        }
    }
}
</style>
