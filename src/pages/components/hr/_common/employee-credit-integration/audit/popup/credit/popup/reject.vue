<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			驳回
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem label="驳回原因:" prop="audit_remarks">
				<oa-textarea 
					v-model="formdata.audit_remarks"
					placeholder="请填写驳回原因"
					clearable
					style="width: 220px"
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-reject',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-textarea': TextArea
	},
	props: {
		item: Object
	},
	data() {
		return {
			visible: false,
			formdata: {},
			validator: {
				audit_remarks: [
					{ required: true, message: '请输入驳回原因', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(item => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$request({
						url: '_HR_EMPLOYEE_SCORE_CREDIT_AUDIT_APPLY_POST',
						type: 'POST',
						loading: false,
						param: {
							...this.formdata,
							apply_id: this.item.apply_id,
							status: 2
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const RejectModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>