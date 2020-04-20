<template>
	<i-modal 
		ref="modal" 
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		width="400px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			编辑
		</div>

		<i-form
			ref="form"
			:model="formData"
			:rules="rule"
			:label-width="144"
			class="g-m-t-20"
		>
			<i-form-item label="评分关联产品负责人：" prop="is_relate_charge">
				<i-radio-group v-model="formData.is_relate_charge">
					<i-radio label="1">是</i-radio>
					<i-radio label="0">否</i-radio>
				</i-radio-group>
			</i-form-item>

			<i-form-item label="导出负责人：" prop="is_export_charge">
				<i-radio-group v-model="formData.is_export_charge">
					<i-radio label="1">是</i-radio>
					<i-radio label="0">否</i-radio>
				</i-radio-group>
			</i-form-item>

			<i-form-item label="备注：">
				<oa-limit-words
					v-model="formData.remark"
					:max="200"
					placeholder="请输入提示文字"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, RadioGroup, Radio } from "iview";
import { CreatePortal } from "wya-vc";

export default {
	name: "sc-service-manage-grade-edit-modal",
    
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-radio-group": RadioGroup,
		"i-radio": Radio
	},

	props: {
		service_score_id: Number,
		is_relate_charge: String,
		is_export_charge: String,
		remark: String
	},
    
	data() {
		return {
			visible: false,
			formData: {
				is_relate_charge: "",
				is_export_charge: "",
				remark: ""
			},
			rule: {
				is_relate_charge: [{ required: true, message: '请选择评分关联产品负责人', trigger: 'change' }]
			}
		};
	},
    
	mounted() {
		this.formData.is_relate_charge = this.is_relate_charge;
		this.formData.is_export_charge = this.is_export_charge;
		this.formData.remark = this.remark;
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
				url: "_SC_SERVICE_MANAGE_GRADE_EDIT_POST",
				type: "POST",
				param: {
					service_score_id: this.service_score_id,
					...this.formData,
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

export const Edit = CreatePortal({}, module.exports.default);
</script>