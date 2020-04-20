<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-employee-mentor-select-reason-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			驳回理由
		</div>
		<div class="g-fs-14">
			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="100"
				class="g-m-t-30">
				<i-form-item
					label="驳回理由："
					prop="audit_remark">
					<oa-limit-words
						v-model="formData.audit_remark"
						:max="200"
						placeholder="请输入驳回理由"
						width="220px"/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, Input, Form, FormItem } from "iview";
import { CreatePortal, Copy } from "wya-vc";

export default {
	name: "hr-employee-mentor-select-reason-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-input': Input,
	},

	props: {
		master_apply_id: Number,
		status: Number,
	},
	data() {
		return {
			visible: false,
			formData: {
				audit_remark: '',
			},
			rule: {
				audit_remark: [{ required: true, message: "请输入驳回理由", trigger: "blur" }],
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate(valid => {
				if (valid) {	// 事项驳回
					this.$request({
						url: API_ROOT._HR_ARCHIVES_PERSON_CENTER_RECOMMEND_MASTER_EVALUATE_AUDIT_POST,
						type: "POST",
						param: {
							...this.formData,
							master_apply_id: this.master_apply_id,
							status: this.status
						},
						loading: false
					}).then(res => {
						this.$emit("sure");
						this.$Message.success("操作成功");
					}).catch(err => {
						this.$Message.warning(err.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit("destory");
		}
	}
};
export const RejectModal = CreatePortal({}, module.exports.default);
</script>
