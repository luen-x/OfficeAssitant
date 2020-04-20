<template>
	<div>
		<i-drawer
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-salary-social-subsidy-popup-details"
			@on-close="$emit('close')"
		>
			<div>
				<oa-title title="师傅评定"/>
				<i-row>
					<i-col span="7">
						<span>申请人:</span>
						<span class="g-m-l-20">{{ params.row.staff_name }}</span>
					</i-col>
					<i-col span="7">
						<span>手机号码:</span>
						<span class="g-m-l-20">{{ params.row.mobile }}</span>
					</i-col>
					<i-col span="7">
						<span>员工工号:</span>
						<span class="g-m-l-20">{{ params.row.staff_number }}</span>
					</i-col>
					<i-col span="7" class="g-m-t-20 g-m-b-10">
						<span>所属部门:</span>
						<span class="g-m-l-20">{{ params.row.depart_name }}</span>
					</i-col>
					<i-col span="7" class="g-m-t-20 g-m-b-10">
						<span>员工职位:</span>
						<span class="g-m-l-20">{{ params.row.position_name }}</span>
					</i-col>
					<i-col span="7" class="g-m-t-20 g-m-b-10">
						<span>申请日期:</span>
						<span class="g-m-l-20">{{ params.row.apply_time }}</span>
					</i-col>
				</i-row>
			</div>
			<oa-title title="评定信息"/>
			<i-table 
				:columns="columns" 
				:data="tableData" 
				border 
				class="_table" 
				stripe
			/>
			<div 
				v-if="params.row.is_operate===1&&type==='2'"
				class="_detail-footer g-flex g-flex-ac" 
				style="marginTop: 46px;">
				<i-button class="g-m-r-10" @click="handleCancel">取消</i-button>
				<i-button type="primary" @click="handleSave">确定</i-button>
			</div>
		</i-drawer>
	</div>
</template>

<script>
import {
	Drawer,
	Select,
	Option,
	Button,
	Row,
	Col,
	Table
} from "iview";
import { CreatePortal, ImgsPreview } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Title from "@components/hr/_common/title";
import item from "./item";

export default {
	name: "salary-social-subsidy-popup-details-drawer",
	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-row": Row,
		"i-col": Col,
		"i-table": Table,
		"i-select": Select,
		"i-option": Option,
		"oa-title": Title
	},
	mixins: [item],
	props: {
		params: Object,
		type: String | Number,
	},
	data() {
		return {
			closable: false,
			tableData: this.params.row.rules || [],
		};
	},
	watch: {
		params() {
			this.tableData = this.params.row.rules;
		}
	},
	mounted() {
		this.closable = true;	
	},
	methods: {
		handleSave() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_MENTOR_SELECT_SAVE_RULE_POST,
				type: "POST",
				param: {
					rules: this.tableData,
					master_apply_id: this.params.row.master_apply_id
				},
				loading: false
			}).then(res => {
				this.$Message.success("保存成功");
				this.$emit("sure");
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel() {
			this.$emit("close");
		
		},
		
	}
};
export const DetailDrawer = CreatePortal(
	{ store: app.$store, alive: true },
	module.exports.default
);
</script>

<style lang="scss">
.v-salary-social-subsidy-popup-details {
    ._form {
        margin-top: 30px;
        margin-left: -30px;
    }
    ._detail-header {
        color: #000;
        font-size: 16px;
        height: 31px;
        line-height: 31px;
    }
    ._demo-drawer-profile {
        margin-top: 14px;
    }
    ._detail-footer {
        width: 940px;
        height: 61px;
        position: fixed;
        bottom: 0;
        right: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: left;
        background: #fff;
        box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
    }
	._table{
		width: 870px;
		.ivu-table-row{
			height:54px !important;
		}
	}
}
</style>
