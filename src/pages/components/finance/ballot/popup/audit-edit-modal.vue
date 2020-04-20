<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="编辑审核结果"
			class="v-hr-remark-model"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form 
				ref="formData" 
				:model="formData" 
				:label-width="100" 
				:rules="formDataRule" 
				class="g-m-t-20">
				<i-form-item label="审核结果" prop="status">
					<i-radio-group v-model="formData.status">
						<i-radio :label="2">通过</i-radio>
						<i-radio :label="4">驳回</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item :label="formData.status === 4 ? '驳回原因' : '通过说明'" prop="audit_remark">
					<oa-limit-words
						v-model="formData.audit_remark"
						:max="50"
						width="220px"
						placeholder="请输入文字"
					/>
					<!-- type="daterange" -->
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, DatePicker, Form, FormItem, Message, Input, Radio, RadioGroup } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';

export default {
	name: 'hr-recruit-remark-modal',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio
	},
	props: {
		name: Number,
		datas: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			// data: lodash.cloneDeep(this.datas),
			visible: false,
			formData: {
				status: +this.datas.status,
				audit_remark: this.datas.audit_remark
			},
			formDataRule: {
				audit_remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
				status: [{ required: true, type: 'number', message: '请选择审核结果', trigger: 'blur' }]
			}
		};
	},
	mounted() {
		this.formData.audit_remark = this.datas.audit_remark;
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.handleSave();
		},
		handleSave() {
			this.$request({
				url: API_ROOT['_FINANCE_BALLOT_AUDIT_POST'], // eslint-disable-line
				type: "POST",
				param: {
					invoice_id: this.datas.invoice_id,
					status: this.formData.status,
					audit_remark: this.formData.audit_remark
				}
			}).then((res) => {
				Message.success('审核修改成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const AuditEditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


