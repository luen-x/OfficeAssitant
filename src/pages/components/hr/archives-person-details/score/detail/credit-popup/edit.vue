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
			学分编辑
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem label="学分调整" prop="after">
				<i-input 
					v-model="formdata.after"
					placeholder="请输入调整学分（可输入负数扣分）"
					style="width: 80%"
				/>
			</i-formitem>
			<i-formitem label="备注">
				<oa-textarea 
					v-model="formdata.remarks"
					placeholder="请填写备注"
					clearable
					style="width: 80%"
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, DatePicker } from 'iview';
import { CreatePortal } from 'wya-vc';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-detail-edit',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'oa-textarea': TextArea
	},
	props: {
		record_id: Number
	},
	data() {
		return {
			visible: false,
			formdata: {},
			validator: {
				after: [
					{ required: true, message: '请输入学分调整', trigger: 'blur' }
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
						url: '_HR_EMPLOYEE_SCORE_CREDITINTE_DETAIL_EDIT_POST',
						type: 'POST',
						loading: false,
						param: {
							...this.formdata,
							record_id: this.record_id
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
export const EditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>