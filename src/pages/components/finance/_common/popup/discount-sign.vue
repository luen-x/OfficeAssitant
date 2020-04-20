<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="标记折扣"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
		@submit.native.prevent
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="80"
			class="g-pd-l-20"
		>
			<i-form-item label="折扣：" prop="rate">
				<i-input-number 
					v-model="formData.rate" 
					:max="10" 
					:min="0" 
					:active-change="false" 
					:precision="1"
					placeholder="请输入折扣" 
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
	name: "oa-sale-",
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
		rate: [Number, String],
		contractId: Number,
	},
	data() {
		let rate = parseFloat(this.rate);
		if (isNaN(rate)) {
			rate = null;
		}
		return {
			visible: false,
			formData: {
				is_sign: 1,
				contract_id: this.contractId,
				rate
			},
			rules: {
				rate: [{ required: true, type: 'number', message: "请填写折扣", trigger: "blur" }]
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
						url: '_FINANCE_CUSTOMER_DISCOUNT_SIGN_POST',
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
export const DiscountSign = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>