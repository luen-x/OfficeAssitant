<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			切换邮箱
		</div>

		<i-form
			ref="form"
			:model="form"
			class="g-m-t-20 g-m-l-30"
		>
			<div class="g-c-black g-m-b-20">请选择发件邮箱账号：</div>
			<i-form-item label="" prop="">
				<i-radio-group v-model="staff_email_ids" vertical>
					<i-radio 
						v-for="item in email_lists" 
						:label="item.staff_email_id"
						:key="item.staff_email_id"
					>
						<span>邮箱账号：{{ item.account }}</span>
					</i-radio>
				</i-radio-group>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, RadioGroup, Radio } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-customer-send-email-login-modal",

	components: {
		"i-modal": Modal,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-form": Form,
		"i-form-item": FormItem
	},

	props: {
		email_lists: Array,
		staff_email_id: Number
	},

	data() {
		return {
			visible: false,
			form: {},
			staff_email_ids: null
		};
	},

	mounted() {
		this.staff_email_ids = this.staff_email_id;
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.visible = false;
			this.$emit("sure", this.staff_email_ids);
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};
export const LoginModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>