<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="标记复购"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
		@submit.native.prevent
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="100"
			class="g-pd-l-20"
		>
			<i-form-item label="复购金额：" prop="repeat_amount">
				<i-input-number 
					v-model="formData.repeat_amount" 
					:max="9999999.99" 
					:min="0.01" 
					:active-change="false" 
					:precision="2" 
					placeholder="请输入复购金额" 
					style="width: 220px"/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, InputNumber, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

export default {
	name: "oa-sale-rebuy-sign",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input-number': InputNumber,
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
		repeatAmount: [Number, String],
		contractId: Number,
	},
	data() {
		let repeatAmount = parseFloat(this.repeatAmount);
		if (isNaN(repeatAmount)) {
			repeatAmount = null;
		}
		return {
			visible: false,
			formData: {
				contract_id: this.contractId,
				repeat_amount: repeatAmount
			},
			rules: {
				repeat_amount: [{ required: true, type: 'number', message: "请填写复购 金额", trigger: "blur" }]
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
						url: '_FINANCE_CUSTOMER_REBUY_SIGN_POST',
						type: "POST",
						param: {
							...this.formData
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
export const RebuySign = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>