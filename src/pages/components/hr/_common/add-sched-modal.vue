<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:mask-closable="false"
			:loading="true"
			class="c-modal-container"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ !!scheduleId ? '编辑日程' : '添加日程' }}
			</div>
			<i-form 
				ref="formValidate"
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100" 
				class="g-m-t-20"
			>
				<i-formitem label="提醒:" prop="schedule_content">
					<i-input
						v-model="formValidate.schedule_content"
						:maxlength="15"
						style="width: 90%"
						placeholder="请输入提示文字(最多15个字)"
					/>
				</i-formitem>
				<i-formitem :label="`提醒${type == 'recruit' ? '时间' : '日期'}`" prop="remind_time">
					<i-datepicker
						:value="formValidate.remind_time" 
						:type="type == 'recruit' ? 'datetime' : 'date'"
						:format="type == 'recruit' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'"
						:placeholder="`请选择提醒${type == 'recruit' ? '时间' : '日期'}`"
						style="width: 90%"
						transfer
						@on-change="handleChange($event, 'remind_time')" 
					/>
				</i-formitem>
				<i-formitem v-if="show" label="提醒次数:" prop="remind_times">
					<i-input-number
						v-model="formValidate.remind_times"
						:precision="0"
						:min="1"
						:max="15"
						style="width: 90%"
						placeholder="请输入提醒次数"
					/>
				</i-formitem>
				<i-formitem v-if="show &&formValidate.remind_times>1" label="提醒周期:" prop="remind_period">
					<i-input-number
						v-model="formValidate.remind_period"
						:precision="0"
						:min="1"
						:max="90"
						style="width: 90%"
						placeholder="请输入提醒周期（天）"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Input, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import net from '@utils/net';
import moment from "moment";

export default {
	name: 'hr-main-add-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
	},
	props: {
		name: String,
		show: {
			type: Boolean,
			default: () => true
		},
		scheduleId: String | Number,
		type: String,
		remindTime: Object | String,
	},
	data() {
		let info = this.$options.propsData.data || {};
		return {
			visible: false,
			options: {
				 date(date) {
					return date && Date.now() - 86400000;
				}
			},
			formValidate: {
				schedule_content: info.schedule_content || '',
				remind_period: Number(info.remind_period) || '',
				remind_times: Number(info.remind_times) || 1,
				remind_time: info.remind_time || this.remindTime || moment().format('YYYY-MM-DD'),
				create_time: info.create_time || '',
			},
			ruleValidate: {
				schedule_content: [
					{ required: true, message: '请输入提示文字' },
					{ type: 'string', max: 15, message: '超出15个字', trigger: 'change' }
				],
				remind_time: [
					{ required: true, message: '请选择提醒日期' }
				],
				remind_period: [
					{ required: true, message: '提醒周期' }
				],
				remind_times: [
					{ required: true, message: '提醒次数' }
				],
			}
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleChange(value, type) {
			this.formValidate[type] = value;
		},
		handleSave() {
			this.$request({
				url: API_ROOT["_HR_MAIN_ADD_SCHEDULE_POST"], // eslint-disable-line
				type: 'POST',
				param: {
					...this.formValidate,
					schedule_id: this.scheduleId
				}
			}).then((res) => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const AddSchedModal = CreatePortal({
	onBefore({ scheduleId }) {
		if (scheduleId) {
			return net.ajax({
				url: API_ROOT["_HR_MAIN_ADD_SCHEDULE_GET"], // eslint-disable-line
				type: 'GET',
				param: {
					schedule_id: scheduleId
				}
			});
		} else {
			return new Promise((resolve, reject) => {
				resolve({});
			});
		}
	}
}, module.exports.default);
</script>

<style lang="scss">
.c-modal-container {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
}
</style>