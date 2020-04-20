<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			{{ isEdit ? '编辑' : '新增' }}考勤
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem v-if="!isEdit" label="员工姓名:" prop="staff_id">
				<i-select
					v-model="formdata.staff_id"
					:remote-method="loadStaff"
					:loading="staffLoading"
					filterable
					remote
					style="width: 220px"
					placeholder="请输入员工关键字搜索"
					clearable
				>
					<i-option 
						v-for="(option, index) in staffData" 
						:value="option.value" 
						:key="index">{{ option.label }}</i-option>
				</i-select>
			</i-formitem>
			<i-formitem v-else label="员工姓名:">
				{{ formdata.staff_name }}
			</i-formitem>
			<i-formitem v-if="!isEdit" label="考勤月份:" prop="month">
				<i-datepicker
					v-model="formdata.month"
					type="month"
					placeholder="请选择考勤月份"
					style="width: 220px"
					transfer
				/>
			</i-formitem>
			<i-formitem label="出勤天数:" prop="presence_day">
				<i-input-number 
					v-model="formdata.presence_day"
					:max="99"
					:min="0"
					placeholder="请输入出勤天数"
					style="width: 220px"
				/>
			</i-formitem>
			<i-formitem label="缺勤天数:" prop="absence_day">
				<i-input-number 
					v-model="formdata.absence_day"
					:max="99"
					:min="0"
					placeholder="请输入缺勤天数"
					style="width: 220px"
				/>
			</i-formitem>
			<i-formitem label="全勤奖金:" prop="full_bonus">
				<i-input-number 
					v-model="formdata.full_bonus"
					:max="9999"
					:min="0"
					placeholder="请输入全勤奖金"
					style="width: 220px"
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, DatePicker, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import { searchStaff } from '@stores/services/hr';

export default {
	name: 'hr-check-add',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker
	},
	mixins: [searchStaff],	
	props: {
		isEdit: Boolean,
		info: Object
	},
	data() {
		return {
			visible: false,
			formdata: {
				presence_day: null,
				absence_day: null,
				full_bonus: null,
				...this.info,
			},
			validator: {
				staff_id: [
					{ required: true, type: 'number', message: '请选择员工', trigger: 'change' }
				],
				presence_day: [
					{ required: true, type: 'number', message: '请输入出勤天数', trigger: 'blur' },
					{ pattern: /^[0-9]+(\.\d+)?$/, message: '请输入正数', trigger: 'blur' }
				],
				absence_day: [
					{ required: true, type: 'number', message: '请输入缺勤天数', trigger: 'blur' },
					{ pattern: /^[0-9]+(\.\d+)?$/, message: '请输入正数', trigger: 'blur' }
				],
				full_bonus: [
					{ required: true, type: 'number', message: '请输入全勤奖励', trigger: 'blur' },
					{ pattern: /^[0-9]+(\.\d+)?$/, message: '请输入正数', trigger: 'blur' }
				],
				month: [
					{ required: true, type: 'date', message: '请选择考勤月份', trigger: 'change' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(item => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$request({
						url: '_HR_EMPLOYEE_CHECK_ADD_POST',
						type: 'POST',
						param: {
							...this.formdata,
							month: this.formdata.month && moment(this.formdata.month).format('YYYY-MM')
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch(err => {
						this.$Message.success(err.msg);
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>