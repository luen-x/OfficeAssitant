<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			class="v-hr-academy-schedule-model"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				我要报名
			</div>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item label="报名课程：" prop="classes">
					<i-select
						v-model="formData.classes"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择可报名的课程"
					>
						<i-option
							v-for="(item, index) in datas"
							:key="index"
							:value="item.course_id"
						>
							{{ item.course_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="推荐人：" prop="referee_name">
					<i-select
						ref="staff" 
						:remote-method="loadStaff"
						:loading="staffLoading"
						v-model="formData.referee_name"
						filterable
						clearable
						transfer
						remote
						label-in-value
						class="g-m-r-5"
						placeholder="请输入报名推荐人名称搜索"
						style="display: inline-block; width: 220px"
						@on-change="handleChangeSelect"
					>
						<i-option v-for="(option, index) in staffData" :value="option.value" :key="index">{{ option.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="报名理由：">
					<oa-limit-words
						v-model="formData.apply_remark"
						:max="200"
						style="width: 220px"
						placeholder="请输入报名理由"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Message, Select, Option, InputNumber } from 'iview';
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
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
	},
	mixins: [staffByMutiTerm],
	props: {
		name: Number,
		datas: {
			type: Array,
			default: () => [{}, {}]
		},
		record: Number
	},
	data() {
		return {
			visible: false,
			formData: {
				classes: '',
				time: [],
				referee_name: ''
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			formdataRule: {
				time: [{
					type: 'array',
					required: true,
					fields: {
						0: { type: 'date', required: true, message: '请输入起止日期' },
						1: [{ type: 'date', required: true, message: '请输入起止日期' }
						],
					}
				}
				],
				classes: [{ type: 'number', required: true, message: '请选择报名课程', trigger: 'change' }],
				referee_name: [
					{ required: true, type: 'number', message: '请选择推荐人', trigger: 'blur' }
				],
			},
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleChangeSelect() {
			if (this.$refs.staff) {
				this.$refs.form.validateField("referee_name");
			}
		},
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			let projectId = '';
			this.datas.map(item => {
				if (item.course_id == this.formData.classes) {
					projectId = item.project_id;
				}
				return;
			});
			let obj = {
				apply_remark: this.formData.apply_remark,
				course_id: this.formData.classes,
				project_id: projectId,
				referee_name: this.$refs.staff.query.split('/')[0],
				referee_staff_id: this.formData.referee_name
			};
			this.$request({
				url: API_ROOT['_SALE_TRAIN_COURSE_SCHEDULE_APPLY_POST'], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				Message.success('报名成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const EnrollModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


