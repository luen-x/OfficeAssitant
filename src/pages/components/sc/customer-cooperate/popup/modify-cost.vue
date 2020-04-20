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
			修改成本
		</div>

		<i-form
			ref="form"
			:label-width="106"
			:model="formData"
			:rules="ruleData"
			class="g-m-t-20"
		>
			<i-form-item label="产品成本：" prop="need_cost_amount">
				<i-input-number
					v-model="formData.need_cost_amount"
					:min="0"
					:max="1000000"
					:precision="2"
					:active-change="false"
					style="width:220px"
					placeholder="请输入产品成本"
				/>
			</i-form-item>

			<i-form-item v-if="is_cost_instalment" label="实扣成本：" prop="cost_amount">
				<i-input-number
					v-model="formData.cost_amount"
					:min="0"
					:max="1000000"
					:precision="2"
					:active-change="false"
					style="width:220px"
					placeholder="请输入实扣成本"
				/>
			</i-form-item>

			<i-form-item label="修改原因：" prop="remark">
				<oa-limit-words
					v-model="formData.remark"
					:max="200"
					placeholder="请输入修改原因"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, InputNumber } from "iview";
import { CreatePortal } from "wya-vc";

export default {
	name: "sc-customer-audit-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-form": Form,
		"i-form-item": FormItem
	},

	props: {
		contract_id: Number,
		project_id: Number,
		need_cost_amount: String,
		is_cost_instalment: Number
	},

	data() {
		return {
			visible: false,
			formData: {
				cost_amount: null,
				need_cost_amount: null,
				reason: ""
			},
			ruleData: {
				need_cost_amount: [
					{
						required: true,
						message: "产品成本是必填的！",
						type: "number",
						trigger: "change"
					}
				],
				cost_amount: [
					{
						required: true,
						message: "实扣成本是必填的！",
						type: "number",
						trigger: "change"
					}
				],
				remark: [
					{
						required: true,
						message: "修改原因是必填的！",
						trigger: "blur"
					}
				]
			}
		};
	},

	mounted() {
		this.formData.need_cost_amount = +this.need_cost_amount;
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_COST_POST",
				type: "POST",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id,
					...this.formData
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.visible = false;
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		
		handleCancel() {
			this.$emit("close");
		}
	}
};

export const ModifyCostModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>