<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="跟进记录举报"
		width="400" 
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="100"
			class="g-pd-l-10"
		>
			<i-form-item label="举报原因：" prop="reason_type">
				<i-select
					v-model="formData.reason_type"
					:disabled="disableReason"
					placeholder="请选择举报原因"
					style="width:220px"
					clearable
				>
					<i-option
						v-for="(item,index) in reasonList"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="举报说明：" prop="remark">
				<oa-limit-words
					v-model="formData.remark"
					:max="200"
					placeholder="请填写举报说明"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

export default {
	name: "oa-sale-customer-tip-off-link",
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
		'i-option': Option
	},
	props: {
		recordId: Number, // customer_id
		customerId: Number,
		hasTape: Boolean
	},
	data() {
		return {
			visible: false,
			disableReason: !this.hasTape,
			formData: {
				reason_type: this.hasTape ? '' : 1,
				remark: ''
			},
			rules: {
				reason_type: [{ required: true, type: 'number', message: "请选择举报原因", trigger: "change" }],
				remark: [{ required: false, type: 'string', message: "请填写举报说明", trigger: "blur" }]

			},
			reasonList: [
				{ label: '没有明确含义的表述', value: 1 },
				{ label: '通话记录含有辱骂客户信息', value: 2 },
				{ label: '通话记录含有虚假承诺信息', value: 3 }
			]


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
						url: '_SALE_CUSTOMER_REPORT_SAVE_POST',
						type: "POST",
						param: {
							...this.formData,
							record_id: this.recordId,
							customer_id: this.customerId,
							type: 2 // 举报类型 1-错误关联举报，2-跟进记录举报
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
export const TipOffFollow = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>