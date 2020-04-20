<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="指派"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formDataRule" 
				class="g-m-t-20"
			>
				<i-form-item label="指派：" prop="try_depart_id">
					<i-cascader
						v-model="formData.try_depart_id"
						:data="departAll"
						:change-on-select="true"
						clearable
						transfer
						trigger="click"
						placeholder="请选择试岗部门"
						style="width: 220px;"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Cascader } from 'iview';
import { CreatePortal } from 'wya-vc';
import { services } from "@stores/services/hr";

export default {
	name: 'v-academy-transfer-assign-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		"i-cascader": Cascader
	},
	mixins: [services.departAll()],
	props: {
		applicantId: {
			required: true,
			type: Number
		}
	},
	data() {
		return {
			formData: {
				try_depart_id: []
			},
			formDataRule: {
				try_depart_id: [
					{
						required: true,
						message: "请选择试岗部门！",
						trigger: "change",
						type: "array"
					}
				]
			},
			visible: false
		};
	},
	mounted() {
		this.loadDepartAll();
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			this.$request({
				url: "_ACADEMY_TRANSFER_TRANSFER_TRY_DEPART_POST",
				type: "POST",
				param: {
					applicant_id: this.applicantId,
					try_depart_id: this.formData.try_depart_id[this.formData.try_depart_id.length - 1],
					scenario: 3
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const Assign = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>