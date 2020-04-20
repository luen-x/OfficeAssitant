<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:footer-hide="showFoot?true:false"
		title="申请进度"
		width="680px"
		class="v-hr-details-change-pwd-modal"
		@on-cancel="handleCancel"
	>
		<oa-across-table
			:data="status_title_array"
		/>
		<!-- <i-steps :current="current" :status="error">
			<i-step :content="info.apply_name" title="提交申请"/>
			<i-step title="员工上级" content/>
			<i-step title="三立学府" content/>
		</i-steps> -->
		<div v-if="info.audit_remark||info.leader_audit_remark" class="g-m-t-10 g-m-l-20 g-flex">
			<div class="g-c-black4 _reject" >驳回理由：</div>
			<div class="g-c-black3">{{ info.audit_remark }} {{ info.leader_audit_remark }}</div>
		</div>
		<div v-if="info.cycle" class="g-m-t-10">
			<span>评选周期：</span>
			<span>{{ info.cycle }}</span>
		</div>
		<i-table
			v-if="info.rule&&info.rule.length"
			:columns="columns"
			:data="info.rule"
			class="g-m-t-10"
			border
		/>
		<div
			v-if="info.rule.length"
			class="g-m-t-10"
			style="color:red"
		>评选规则全部通过后，本次评定期结束后将自动评选为微一案师傅。</div>
		<div slot="footer">
			<i-button 
				v-if="info.is_show_cancel_join===1" 
				type="text" 
				@click="handleParticipation">取消参与</i-button>
			<i-button 
				v-if="error==='error'" 
				:type="info.is_show_cancel_join===1 || error==='' ?'text':'primary'" 
				@click="handleRecommend">重新申请</i-button>
			<i-button 
				v-if="error===''" 
				type="primary" 
				@click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import {
	Modal,
	Form,
	FormItem,
	Input,
	Button,
	Steps,
	Step,
	Table
} from "iview";
import { CreatePortal } from "wya-vc";
import AcrossTable from '@components/_common/across-table/across-table';
import API_ROOT from "@stores/apis/root";


export default {
	name: "vc-hr-summary-details-password-modal",
	components: {
		"i-modal": Modal,
		"i-steps": Steps,
		"i-step": Step,
		"i-button": Button,
		"i-table": Table,
		"oa-across-table": AcrossTable
	},
	props: {
		staff_id: String,
		showFoot: Boolean
	},
	data() {
		return {
			visible: false,
			columns: [
				{
					title: "评选规则",
					key: "name"
				},
				{
					title: "评选结果",
					key: "status_name"
				}
			],
			status_title_array: [],
			current: null,
			error: "",
			info: {
				rule: [],
				status: 0,
				audit_remark: "",
				leader_audit_remark: "",
				apply_name: "",
				cycle: "",
				master_apply_id: "",
				is_show_cancel_join: ''
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleOk() {
			this.visible = false;
		},
		handleCancel() {
			this.visible = false;
		},
		handleRecommend() {
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBER_MASTER_RECOMMEND_MASTER_POST,
				type: "POST",
				param: {
					staff_id: [this.staff_id],
					type: 2
				}
			}).then(res => {
				this.visible = false;
				this.$Message.success(res.msg);
				this.$emit("sure");
			}).catch(err => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(err.msg);
			});
		},
		handleParticipation() {
			this.$request({
				url:
                    API_ROOT._HR_PERSONNEL_MEMBER_MASTER_CANCEL_MASTER_APPLY_POST,
				type: "POST",
				param: {
					master_apply_id: this.info.master_apply_id
				}
			}).then(res => {
				this.visible = false;
				this.$Message.success(res.msg);
				this.$emit("sure");
			}).catch(err => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(err.msg);
			});
		},
		loadData() {
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBER_MASTER_APPLY_RATE_GET,
				type: "GET",
				param: {
					staff_id: this.staff_id
				}
			}).then(res => {
				this.info = { ...this.info, ...res.data };
				this.status_title_array = res.data.status_title_array;
				if (res.data.status === 5) {
					this.current = 2;
					this.error = "error";
				} else if (res.data.status === 6) {
					if (res.data.audit_remark) {
						this.current = 2;
						this.error = "error";
					} else {
						this.current = 1;
						this.error = "error";
					}
				} else if (res.data.status === 4) {
					this.current = 3;
					this.error = "";
				} else if (res.data.status === 3) {
					this.current = 3;
					this.error = "";
				} else if (res.data.status === 2) {
					this.current = 2;
					this.error = "";
				} else if (res.data.status === 1) {
					this.current = 1;
					this.error = "";
				} else {
					this.current = 1;
					this.error = "";
				}
			}).catch(err => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(err.msg);
			});
		}
	}
};

export const ApplyMasterModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-details-change-pwd-modal {
	._reject{
		width: 60px;
		min-width: 60px;
		max-width: 60px;
	}
    .ivu-modal-content {
        .ivu-modal-body {
            padding-top: 20px;
        }
        .ivu-modal-footer {
            padding: 0px 20px 20px 18px !important;
        }
    }
}
</style>