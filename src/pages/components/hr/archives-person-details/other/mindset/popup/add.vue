<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="500"
		:mask-closable="false"
		:loading="true" 
		:rules="rule"
		title="心态跟踪"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-flex g-flex-ac g-flex-cc">
			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="90"
				class="g-m-t-20">
				<i-form-item label="心态跟踪：" prop="remarks">
					<oa-limit-words
						v-model="formData.remarks"
						:max="500"
						placeholder="请输入心态跟踪"
						width="300px"/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";

export default {
	name: 'hr-confirm',
	components: {
		'i-modal': Modal,
		"i-form": Form,
		"i-form-item": FormItem,
	},
	props: {
		applicant_id: String
	},
	data() {
		return {
			visible: false,
			formData: {
				remarks: '',
			},
			rule: {
				remarks: [{ required: true, message: "请输入心态跟踪", trigger: "blur" }],
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT._HR_RECRUIT_ADD_REMARKS_POST,
						type: "POST",
						param: {
							remarks: this.formData.remarks,
							applicant_id: this.applicant_id,
							type: 3
						},
						loading: false
					}).then(res => {
						this.$emit('sure');
					}).catch(err => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});

		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


