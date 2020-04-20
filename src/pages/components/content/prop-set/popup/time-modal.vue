<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="设置生效时间设定"
		width="400"
		class="v-content-prop-set-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:label-width="130"
			:model="formData" 
			:rules="ruleValidate" 
			class="g-pd-l-10"
		>
			<i-form-item label="生效时间设置：" prop="effect_time">
				<i-datepicker
					v-model="formData.effect_time"
					:options="options"
					:editable="false"
					type="date"
					format="yyyy-MM-dd"
					clearable
					transfer
					placeholder="请选择日期"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
				/>
			</i-form-item>
			<div style="color: #E74854;padding-left: 28px;padding-top: 10px;">
				注意：设置一旦生效，用户库存中未使用的道具将按新规则执行，请提前做好通知准备。
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, DatePicker } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';

export default {
	name: "v-content-prop-set-modal",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-datepicker': DatePicker
	},
	props: {
		time: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			visible: false,
			options: {
				disabledDate(date) {
					return (moment().isAfter(moment(date)));
				}
			},
			formData: {
				effect_time: this.time || ''
			},
			ruleValidate: {
				effect_time: [
					{ required: true, type: "date", message: '请选择时间', trigger: 'change' }
				],
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk(res) {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					if (moment(this.formData.effect_time).format('YYYY-MM-DD HH:mm') < moment().format('YYYY-MM-DD HH:mm')) {
						this.$Message.error('生效时间必须大于当前时间');
						this.$refs.modal.buttonLoading = false;
						return;
					}
					this.visible = false;
					this.$emit('sure', this.formData.effect_time);
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
export const TimeModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-content-prop-set-modal {
}
</style>

