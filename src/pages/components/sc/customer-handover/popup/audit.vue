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
			{{ name === '1' ? '通过申请' : '驳回申请' }}
		</div>

		<i-form
			ref="form"
			:label-width="110"
			:model="formVaData"
			:rules="rule"
			class="g-m-t-20"
		>
			<i-form-item
				v-if="name=='1'"
				:label="type"
				prop="pass"
			>
				<oa-limit-words
					:placeholder="placeholder"
					v-model="formVaData.pass"
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
					v-model="formVaData.cause"
					:max="200"
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
	name: "sc-customer-handover-audit-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem
	},

	props: {
		name: String,
		project_id: Number,
		project_delivery_id: Number
	},

	data() {
		return {
			visible: false,
			formVaData: {
				pass: "", // 通过 
				cause: "" // 驳回
			},
			rule: {
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
			return this.name === "1" ? "请输入说明" : "请输入原因";
		}
	},

	mounted() {
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
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
				url: "_SC_CUSTOMER_HANDOVER_DELIVERY_AUDIT_POST",
				type: "POST",
				param: {
					project_delivery_id: this.project_delivery_id,
					project_id: this.project_id,
					audit_type: this.name === "1" ? 1 : 2,
					remark: this.name === "1" ? this.formVaData.pass : this.formVaData.cause
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$store.commit("SC_CUSTOMER_HANDOVER_LIST_RESET", {
					type: ""
				});
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.visible = true;
			});
		}
	}
};
export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>