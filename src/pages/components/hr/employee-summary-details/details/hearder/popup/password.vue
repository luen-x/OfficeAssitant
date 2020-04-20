<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="更改密码"
		width="400px"
		class="v-hr-details-change-pwd-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="addForm"
			:rules="addRule"
			:label-width="100"
		>
			<i-form-item label="新密码" prop="new_pwd">
				<i-input
					v-model="addForm.new_pwd"
					placeholder="请输入密码"
					style="width: 220px;"
					type="password"
				/>
			</i-form-item>
			<i-form-item label="确认密码" prop="confirm_pwd">
				<i-input
					v-model="addForm.confirm_pwd"
					type="password"
					placeholder="再次输入密码"
					style="width: 220px;"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Button } from "iview";
import { CreatePortal } from "wya-vc";
import md5 from 'js-md5';
import API_ROOT from "@stores/apis/root";

export default {
	name: "vc-hr-summary-details-password-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-button": Button,
	},
	props: {
		staff_id: String,
	},
	data() {
		return {
			visible: false,
			title: '',
			addForm: {
				new_pwd: '',
				confirm_pwd: ''
			},
			addRule: {
				new_pwd: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
				confirm_pwd: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
			},
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_HEADER_MODIFY_PWD_POST,
						type: "POST",
						param: {
							staff_id: this.staff_id,
							new_pwd: md5(this.addForm.new_pwd),
							confirm_pwd: md5(this.addForm.confirm_pwd),
						}
					}).then(res => {
						this.visible = false;
						this.$Message.success(res.msg);
					}).catch(err => { this.$refs.modal.buttonLoading = false; this.$Message.error(err.msg); });
				} else {
			        this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};

export const PWDModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-details-change-pwd-modal{
	.ivu-modal-content{
		.ivu-modal-body{
			padding-top:34px;
		}
		.ivu-modal-footer{
			padding:0px 20px 20px 18px !important;
		}
	}
}
</style>