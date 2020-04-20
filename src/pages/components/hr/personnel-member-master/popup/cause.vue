<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-collage-refund-audit"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>
			驳回申请
		</div>

		<i-form
			ref="formValidate"
			:label-width="75"
			:model="formData"
			:rules="ruleValidate"
			class="g-m-t-20"
			style="margin-left: 25px"
		>
			<i-form-item
				label="驳回原因"
				prop="leader_audit_remark"
			>
				<oa-limit-words
					v-model="formData.leader_audit_remark"
					:max="200" 
					placeholder="请输入驳回原因"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Input } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "collage-customer-audit-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem
	},

	props: {
		master_apply_id: Number
	},

	data() {
		return {
			visible: false,
			formData: {
				leader_audit_remark: ""
			},
			ruleValidate: {
				leader_audit_remark: [
					{
						required: true,
						message: "驳回原因是必填的！",
						trigger: "blur"
					}
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleSave() {
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBER_MASTER_REFUSE_APPLY_POST,
				type: "POST",
				param: {
					master_apply_id: this.master_apply_id,
					leader_audit_remark: this.formData.leader_audit_remark
				}
			}).then(res => {
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
export const CauseModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>