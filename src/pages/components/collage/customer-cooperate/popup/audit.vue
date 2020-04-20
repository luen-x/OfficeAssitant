<template>
	<i-modal 
		v-model="visible" 
		:width="400"
		:loading="true"
		:footer-hide="true"
		:mask-closable="false"
		class="v-collage-cooperate-audit"
	>
		<div slot="header" class="g-tc">
			{{ name === '1' ? '通过申请' : '驳回申请' }}
		</div>

		<i-form 
			ref="form" 
			:label-width="85"
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

		<div class="_footer">
			<i-button 
				type="text"
				style="margin-right: 6px;"
				@click="handleCancel"
			>
				取消
			</i-button>
			<i-button 
				type="text" 
				class="_sure"
				@click="handleOk"
			>
				确定
			</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Input, Button } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";

export default {
	name: "collage-customer-audit-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-button": Button
	},

	props: {
		name: String,
		contract_id: Number,
		project_id: Number
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
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			this.$request({
				url: "_COLLAGE_CUSTOMER_COOPERATE_AUDIT_POST",
				type: "POST",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id,
					status: this.name === "1" ? 1 : 2,
					audit_remark: this.name === "1" ? this.formData.pass : this.formData.cause
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleCancel() {
			if ((this.name == "1" && !this.formData.pass) 
			|| (this.name == "2" && !this.formData.cause)) {
				this.visible = false;
				this.$emit("close");
			} else {
				Confirm.popup({
					title: "取消提示",
					msg: "取消后你所填写的内容将无法恢复，确认取消？"
				}).then(() => {
					this.visible = false;
					this.$emit("close");
				});
			}
		}
	}
};
export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-collage-cooperate-audit{
	._footer{
		text-align: right;
		padding-top: 20px;

		._sure{
			color: #ffffff;
			background-color:#e74854 !important;
			border-color:#e74854 !important;

			&:hover{
				color: #ffffff !important;
				background-color:#e74854 !important;
				border-color:#e74854 !important;
			}
		}
	}
}
</style>