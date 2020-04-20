<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="设置生效时间设定"
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
			<i-form-item label="生效时间设置:" prop="effect_date">
				<i-date-picker
					v-model="formData.effect_date"
					:options="options"
					:editable="false"
					transfer
					format="yyyy-MM-dd"
					type="date"
					placeholder="请选择生效时间设置"
					style="width: 220px"/>
			</i-form-item>
			<div class="g-c-red-mid g-m-t-10">
				注意：设置一旦生效，修改规则后，用户所涉及到未结算的微币任务将被清空，
				请谨慎操作。建议设置生效时间为下个月，并多次通知市
				场部员工尽快完成待结算的任务。
			</div>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, DatePicker } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
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
		'i-date-picker': DatePicker
	},
	props: {
		data: Object, // customer_id
		setting: Array,
		effect_time: {
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
				effect_date: this.effect_time || ''
			},
			rules: {
				effect_date: [
					{ required: true, type: "date", message: '请选择时间', trigger: 'change' }
				],
			}
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
			if (moment(this.formData.effect_date).format('YYYY-MM-DD HH:mm') < moment().format('YYYY-MM-DD HH:mm')) {
				this.$Message.error('生效时间必须大于当前时间');
				this.$refs.modal.buttonLoading = false;
				return;
			}
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_CONTENT_REWARD_SETTING_SAVE_POST',
						type: "POST",
						param: {
							setting: this.setting,
							effect_date: moment(this.formData.effect_date).format('YYYY-MM-DD HH:mm')
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
export const SelectTime = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>