<template>
	<i-modal
		ref="modal"
		:loading="true"
		:mask-closable="false"
		v-model="visible"
		title="更改密码"
		width="400px"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<i-form ref="formValidate" :model="addForm" :rules="addRule" :label-width="100">
			<!-- <i-form-item label="请输入原密码" prop="old_pwd">
				<i-input 
					v-model="addForm.old_pwd" 
					autocomplete="off" 
					placeholder="请输入密码" 
					style="width: 220px;"
					type="password"
				/>
			</i-form-item> -->
			<i-form-item label="新密码" prop="new_pwd">
				<i-input 
					v-model="addForm.new_pwd" 
					autocomplete="off" 
					placeholder="请输入密码" 
					style="width: 220px;" 
					type="password"
				/>
			</i-form-item>
			<i-form-item label="确认密码" prop="confirm_pwd">
				<i-input 
					v-model="addForm.confirm_pwd" 
					autocomplete="off" 
					type="password" 
					placeholder="再次输入密码"
					style="width: 220px;"
				/>
			</i-form-item>
			<input style="display:none">
			<input v-show="!1" type="text" name="username" autocomplete="off">
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import md5 from 'js-md5';

export default {
	name: "vc-hr-summary-details-password-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
	},
	data() {
		return {
			visible: false,
			title: '',
			addForm: {
				// old_pwd: '',
				new_pwd: '',
				confirm_pwd: ''
			},
			addRule: {
				// old_pwd: [{ required: true, message: '请填写原密码', trigger: 'blur' }],
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
			this.$refs.modal.buttonLoading = false;
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_HEADER_MODIFY_PWD_POST,
						type: "POST",
						param: {
							staff_id: this.$global.staff.staff_id,
							new_pwd: md5(this.addForm.new_pwd),
							confirm_pwd: md5(this.addForm.confirm_pwd),
						}
					}).then(res => {
						this.visible = false;
						this.$Message.success({
							content: res.msg,
							duration: 1.5,
							onClose: () => {
								this.$emit('sure');
							}
						});
					}).catch(err => { this.$Message.error(err.msg); });
					  // this.$emit("sure");
				}
			});
		},
		handleCancel() {
			// this.visible = false;
			this.$emit("close");
		}
	}
};

export const PWDModal = CreatePortal({}, module.exports.default);
</script>
