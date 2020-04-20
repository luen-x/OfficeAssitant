<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		:footer-hide="true"
		class="v-collage-cooperate-modify-cost"
	>
		<div slot="header" class="g-tc">
			修改成本
		</div>

		<i-form
			ref="form"
			:label-width="115"
			:model="formData"
			:rules="rule"
			class="g-m-t-20"
		>
			<i-form-item
				label="业绩金额："
				prop="need_cost_amount"
			>
				<i-input-number
					v-model="formData.need_cost_amount"
					:min="0"
					:max="1000000"
					:precision="2"
					:active-change="false"
					style="width:220px"
					placeholder="请输入业绩金额"
				/>
			</i-form-item>

			<i-form-item
				v-if="is_cost_instalment"
				label="商学院金额："
				prop="cost_amount"
			>
				<i-input-number
					v-model="formData.cost_amount"
					:min="0"
					:max="1000000"
					:precision="2"
					:active-change="false"
					style="width:220px"
					placeholder="请输入商学院金额"
				/>
			</i-form-item>

			<i-form-item
				label="修改原因："
				prop="remark"
			>
				<oa-limit-words
					v-model="formData.remark"
					:max="200"
					placeholder="请输入修改原因"
					style="width: 220px"
				/>
			</i-form-item>

			<div class="g-tr g-pd-20 _footer">
				<i-button 
					type="text"
					class="_cancel"
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
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, InputNumber, Button } from "iview";
import { CreatePortal } from "wya-vc";
import { Confirm } from "@components/_common/confirm/confirm";

export default {
	name: "sc-customer-audit-modal",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-button": Button
	},
	props: {
		contract_id: Number,
		project_id: Number,
		is_cost_instalment: Number,
		need_cost_amount: Number,
		cost_amount: Number
	},
	data() {
		return {
			visible: false,

			formData: {
				cost_amount: null,
				need_cost_amount: null,
				remark: ""
			},

			rule: {
				cost_amount: [
					{
						required: true,
						message: "商学院金额是必填的！",
						type: "number",
						trigger: "change"
					}
				],
				need_cost_amount: [
					{
						required: true,
						message: "业绩金额是必填的！",
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
		this.is_cost_instalment ? this.formData.cost_amount = +this.cost_amount : "";
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			this.$request({
				url: "_COLLAGE_CUSTOMER_COOPERATE_CHANGE_COST_POST",
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
			if (!this.formData.cost_amount && !this.formData.remark && !this.formData.need_cost_amount) {
				this.visible = false;
				this.$emit("close");
			} else {
				Confirm.popup({
					title: "取消提示",
					msg: "取消后你所填写的内容将无法恢复，确认取消？"
				}).then(() => {
					this.visible = false;
				});
			}
		}
	}
};
export const ModifyCostModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-cooperate-modify-cost {
	._footer{
		padding-bottom: 4px;
		padding-right: 4px;

		.ivu-btn{
			font-size: 14px;
			
			&:hover{
				color: #747b8b !important;
				border-color: #ffffff !important;
			}
		}

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

		._cancel{
			margin-right: 18px;

			&:hover{
				color: #d9444f !important;
				border-color:#d9444f !important;
			}
		}
	}
}
</style>