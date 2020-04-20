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
				{{ !!schedule_id ? '编辑日程' : '添加日程' }}
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
						style="width: 220px"
						placeholder="请输入提示文字(最多15个字)"
					/>
				</i-formitem>
				<i-formitem label="提醒日期:" prop="remind_time">
					<i-datepicker
						:value="formValidate.remind_time" 
						:options="options"
						transfer
						style="width: 220px"
						placeholder="请选择提醒日期"
						@on-change="handleChange($event, 'remind_time')" 
					/>
				</i-formitem>
			</i-form>
			<div slot="footer">
				<i-button type="text" @click="handleCancel">取消</i-button>
				<i-button type="primary" @click="handleOk">确定</i-button>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Input, InputNumber, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import net from '@utils/net';
import moment from "moment";

export default {
	name: 'finance-main-add-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-button': Button
	},
	props: {
		name: String,
		show: {
			type: Boolean,
			default: () => true
		},
		schedule_id: String | Number,
		schedule_content: String,
		remind_time: String,
	},
	data() {
		return {
			visible: false,
			options: {
				//  disabledDate(date) {
				// 	return date && date.valueOf() < Date.now() - 86400000;
				// }
			},
			formValidate: {
				schedule_content: this.schedule_content || '',
				remind_time: this.remind_time || moment().format('YYYY-MM-DD')
			},
			ruleValidate: {
				schedule_content: [
					{ required: true, message: '请输入提示文字' },
					{ type: 'string', max: 15, message: '超出15个字', trigger: 'change' }
				],
				remind_time: [
					{ required: true, message: '请选择提醒日期' }
				],
			}
		};
	},
	computed: {
		type() {
			return this.name === '1' ? '通过说明:' : '驳回原因:';
		},
		placeholder() {
			return `请输入${this.type}`;
		}
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
				url: API_ROOT["_FINANCE_MAIN_SAVE_SCHEDULE_POST"], // eslint-disable-line
				type: 'POST',
				param: {
					...this.formValidate,
					schedule_id: this.schedule_id
				}
			}).then((res) => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure', this.formValidate.remind_time);
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const AddSchedModal = CreatePortal({ store: app.$store }, module.exports.default);
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