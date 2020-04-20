<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:mask-closable="false"
		class="v-sc-customer-note"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			备注编辑
		</div>

		<i-form
			:label-width="105"
			class="g-m-t-20"
		>
			<i-form-item label="备注：">
				<oa-limit-words
					v-model="remark"
					:max="100"
					placeholder="请输入模块备注"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Row, Col, Input } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-customer-audit-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem
	},

	props: {
		template_id: String,
		note: String
	},

	data() {
		return {
			visible: false,
			remark: ""
		};
	},

	mounted() {
		if (this.note) {
			this.remark = this.note;
		}

		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_EXPORT_EDIT_REMARK_POST,
				type: "POST",
				param: {
					template_id: this.template_id,
					remark: this.remark.replace(/^\s*|\s*$/g, "")
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const NoteModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>