<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="提示"
			class="v-hr-academy-schedule-model"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div class="g-pd-lr-20 g-m-tb-30 g-fs-14 g-c-black2" style="padding-left: 76px;">
				您保存的试卷与试卷库中的试卷重名了
			</div>
			<i-form
				ref="form" 
				:model="formData" 
				:rules="formdataRule" 
				:label-width="90"
				class="g-m-t-20 g-pd-l-50"
			>
				<i-form-item prop="replace">
					<i-radio-group
						v-model="formData.replace"
						style="width: 220px"
						clearable
						transfer
					>
						<i-radio
							:label="0"
						>
							不替换继续保存
						</i-radio>
						<i-radio
							:label="1"
						>
							替换原有试卷
						</i-radio>
					</i-radio-group>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Message, RadioGroup, Radio, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import { staffByMutiTerm } from "@stores/services/hr";
import { CreatePortal } from 'wya-vc';
import moment from 'moment';

export default {
	name: 'sc-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-input-number': InputNumber,
	},
	mixins: [staffByMutiTerm],
	props: {
	},
	data() {
		return {
			visible: false,
			formData: {
				replace: '',
			},
			formdataRule: {
				replace: [{ type: 'number', required: true, message: '请选择是否替换', trigger: 'change' }],
			},
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.visible = false;
					this.$emit('sure', this.formData.replace);
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const ReplaceModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


