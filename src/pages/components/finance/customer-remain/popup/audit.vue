<template>
	<div>
		<i-modal 
			ref="modal" 
			:loading="true" 
			v-model="visible" 
			:mask-closable="false"
			:footer-hide="$auth['107'] && queryType == 1? false: true"
			width="400"
			class="v-finance-remain-audit"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			
			<div slot="header" class="g-tc">{{ title }}</div>
			<div class="__content">
				<div class="g-m-l-30">
					<oa-title>
						<template slot="title">{{ base_info.before_category_name }}</template>
					</oa-title>
					<div class="g-flex g-fw-w g-m-t-10">
						<oa-detail-item label="更改前余额">{{ base_info.before_category_amount_from }}</oa-detail-item>
						<oa-detail-item label="更改后余额" class="g-m-t-10">{{ base_info.before_category_amount_to }}</oa-detail-item>
					</div>
					<oa-title class="g-m-t-15">
						<template slot="title">{{ base_info.after_category_name }}</template>
					</oa-title>
					<div class="g-flex g-fw-w g-m-t-10">
						<oa-detail-item label="更改前余额">{{ base_info.after_category_amount_from }}</oa-detail-item>
						<oa-detail-item label="更改后余额" class="g-m-t-10">{{ base_info.after_category_amount_to }}</oa-detail-item>
						<oa-detail-item label="转移金额" class="g-m-t-10">{{ base_info.transfer_amount }}</oa-detail-item>
						<oa-detail-item 
							v-if="Number(base_info.depart_share_performance) != 0" 
							label="部门分单" 
							class="g-m-t-10"
						>
							{{ base_info.depart_share_performance }}
						</oa-detail-item>
						<oa-detail-item label="更改理由" class="g-m-t-10">{{ base_info.transfer_remark }}</oa-detail-item>
					</div>
					<oa-title class="g-m-t-15">
						<template slot="title">审核信息</template>
					</oa-title>
					<div v-if="queryType !=1" class="g-flex g-fw-w g-m-t-10">
						<oa-detail-item label="审核人">{{ audit_info.audit_staff_name }}</oa-detail-item>
						<oa-detail-item label="审核时间" class="g-m-t-10">{{ audit_info.audit_time }}</oa-detail-item>
						<oa-detail-item :label="queryType==2?'通过原因':'驳回原因'" class="g-m-t-10">{{ audit_info.audit_remark }}</oa-detail-item>
					</div>
				</div>
				<i-form
					v-if="queryType ==1"
					ref="form"
					:model="audit_info"
					:rules="validator"
					:label-width="100"
					class="g-m-t-10"
				>
					<i-formitem prop="status" label="审核状态">
						<i-radio-group v-model="audit_info.status">
							<i-radio label="1">通过</i-radio>
							<i-radio label="2">驳回</i-radio>
						</i-radio-group>
					</i-formitem>
					<i-formitem
						:label="audit_info.status==1?'通过理由':'驳回理由'"
						prop="audit_remark"
						style="marginTop:-14px"
					>
						<oa-limit-words
							v-model="audit_info.audit_remark"
							:max="200"
							:placeholder="audit_info.status==1?'请填写通过理由':'请填写驳回理由'"
							style="width: 80%"
							class="g-m-t-10"
						/>
					</i-formitem>
				</i-form>
			</div>
			
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, RadioGroup, Radio, Button } from "iview";
import { CreatePortal } from "wya-vc";
import moment from "moment";
import API_ROOT from "@stores/apis/root";
import { DetailItem, Title } from "@components/finance/_common";
import LimitWords from "@common/limit-words/limit-words";

export default {
	name: "finance-customer-audit-modal",
	components: {
		"i-modal": Modal,
		"i-datepicker": DatePicker,
		"i-form": Form,
		"i-formitem": FormItem,
		"oa-title": Title,
		"i-button": Button,
		"oa-detail-item": DetailItem,
		"i-radio": Radio,
		"i-radio-group": RadioGroup,
		'oa-limit-words': LimitWords,
	},
	props: {
		transfer_id: Number,
		queryType: {
			type: String,
			default: '1'
		},
		show: {
			type: Boolean,
			default: () => true
		}
	},
	data() {
		return {
			visible: false,
			base_info: {
				before_category: "", // 更改对象
				after_category: "", // 改后对象
				before_category_name: "", // 更改对象
				after_category_name: "", // 改后对象
				transfer_amount: "", // 转移金额
				transfer_remark: "", // 更改理由
				before_category_amount_from: "", // 改前余额的改前金额
				before_category_amount_to: "", // 改前余额的改后金额
				after_category_amount_from: "", // 改后余额的改前金额
				after_category_amount_to: "" // 改后余额的改后金额
			},
			audit_info: {
				// 审核信息
				audit_staff_name: "", // 审核人姓名
				audit_time: "",
				status: "", // 状态  1待审核  2 已通过 3未通过
				status_name: "",
				audit_remark: ""
			},
			validator: {
				status: [{ required: true, message: "必选项", trigger: "change" }],
				audit_remark: [
					{ required: true, message: "请填写内容", trigger: "blur" }
				]
			}
		};
	},
	computed: {
		title() {
			switch (this.queryType) {
				case "1":
					return "待审核详情";
				case "2":
					return "已通过详情";
				case "3":
					return "未通过详情";
				default:
					break;
			}
		},
		type() {
			return this.status == "1" ? "通过说明:" : "驳回原因:";
		}
	},
	mounted() {
		this.visible = true;
		this.fetchData();
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT._FINANCE_CUSTOMER_REMAIN_AUDIT_GET,
						type: "GET",
						param: {
							transfer_id: this.transfer_id,
							type: this.audit_info.status,
							audit_remark: this.audit_info.audit_remark
						}
					}).then(res => {
						this.$Message.success(res.msg);
						// this.$store.commit("FINANCE_CUSTOMER_ACHI_LIST_INIT");
						this.$emit('sure');
					}).catch(err => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(err.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});	
		},
		handleCancel() {
			// this.$emit("close");
			this.visible = false;
		},
		fetchData() {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_REMAIN_CHANGE_INFO_GET,
				type: "GET",
				param: {
					transfer_id: this.transfer_id
				}
			}).then(res => {
				this.base_info = res.data.base_info;
				this.audit_info = res.data.audit_info;
			}).catch(err => { this.$Message.error(err.msg); });
		}
	}
};
export const AchiAuditModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss">
.v-finance-remain-audit{
	.ivu-modal-content{
		.ivu-modal-body{
			padding-top: 30px !important;
		}
		.ivu-modal-footer{
			padding:0px 20px 20px 18px !important;
			.ivu-btn > span{
				vertical-align:text-top;
			}
		}
	}
	.__content{
		max-height: 500px;
		overflow-y: auto;
	}
}
</style>


