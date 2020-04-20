<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="100"
			class="g-pd-l-20"
		>
			<i-form-item label="评定积分：" prop="point">
				<i-input-number
					v-model="formData.point"
					:precision="0"
					style="width:220px"
					placeholder="请输入评定积分"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, InputNumber } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber
	},
	props: {
		data: Object, // customer_id
		title: String,
		name: String,
	},
	data() {
		return {
			visible: false,
			formData: {
				point: this.data.status == 1 ? this.data.point || null : null,
			},
			rules: {
				point: [{ required: true, type: 'number', message: "请填写评定积分", trigger: "blur" }]
			},
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: this.title == '修改积分' ? '_HR_EMPLOYEE_SCORE_INTEGRATION_EDIT_POST' : '_HR_EMPLOYEE_SCORE_INTEGRATION_GRADE_POST',
						type: "POST",
						param: {
							...this.formData,
							rule_type: 18,
							check_result: '1',
							contract_company_id: this.data.contract_company_id,
							service_record_id: [this.data.complaint_id]
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const PointEdit = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>