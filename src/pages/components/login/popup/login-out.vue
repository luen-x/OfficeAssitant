<template>
	<i-modal
		ref="modal"
		:loading="true"
		:mask-closable="false"
		v-model="visible"
		width="400px"
		title="退出登录"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			class="g-fs-14"
			style="margin: 50px 0 40px 30px; color: #333"
		>
			确定退出登录吗？
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "vc-login-out",
	components: {
		"i-modal": Modal,
	},
	data() {
		return {
			visible: false
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$request({
				url: API_ROOT['_LOGIN_OUT_POST'],
				type: "POST",
				param: {

				}
			}).then(res => {
				this.visible = false;
				this.$refs.modal.buttonLoading = false;
				sessionStorage.removeItem('notice');
				localStorage.removeItem('call_tabs' + _global.version);
				this.$emit('sure');
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});

		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		}
	}
};

export const PModalLoginOut = CreatePortal({}, module.exports.default);
</script>
