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
		<div slot="header" class="g-tc">
			{{ name === '1' ? '通过申请' : '驳回申请' }}
		</div>

		<i-form
			ref="form"
			:label-width="75"
			:model="formData"
			:rules="rule"
			class="g-m-t-20"
			style="margin-left: 25px"
		>
			<i-form-item
				v-if="name=='1'"
				:label="type"
				prop="pass"
			>
				<oa-limit-words
					:placeholder="placeholder"
					v-model="formData.pass"
					:max="200"
					style="width: 220px"
				/>
			</i-form-item>

			<i-form-item
				v-else
				:label="type"
				prop="cause"
			>
				<oa-limit-words
					:placeholder="placeholder"
					v-model="formData.cause" 
					:max="200"
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
		name: String,
		refund_id: Number
	},

	data() {
		return {
			visible: false,
			formData: {
				pass: "",
				cause: ""
			},
			rule: {
				pass: [
					{
						required: true,
						message: "通过原因是必填的！",
						trigger: "blur"
					}
				],
				cause: [
					{
						required: true,
						message: "驳回原因是必填的！",
						trigger: "blur"
					}
				]
			}
		};
	},

	computed: {
		type() {
			return this.name === "1" ? "通过说明:" : "驳回原因:";
		},
		placeholder() {
			return this.name === "1" ? "请输入通过说明:" : "请输入驳回原因:";
		}
	},

	mounted() {
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validate((valid) => {
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
				url: "_COLLAGE_CUSTOMER_REFUND_AUDIT_POST",
				type: "POST",
				param: {
					refund_id: this.refund_id,
					status: this.name === "1" ? 1 : 2,
					refund_remark: this.name === "1" ? this.formData.pass : this.formData.cause
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>