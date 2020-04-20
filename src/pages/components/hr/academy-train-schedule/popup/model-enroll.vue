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
				开通报名
			</div>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item label="报名课程:" prop="classes">
					<i-select
						v-model="formData.classes"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择可报名的课程"
						@on-change="handleChange"
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
				<i-form-item label="报名人数:" prop="number">
					<!-- <i-input-number 
						v-model="formData.number" 
						:max="999" 
						:min="1" 
						:precision="0" 
						:active-change="false" 
						style="width: 220px"/> -->
					<i-input
						v-model="formData.number" 
						:maxlength="3"
						placeholder="请输入报名人数"
						style="width: 220px"/>
				</i-form-item>
				<i-form-item label="报名时间:" prop="time">
					<i-datepicker
						v-model="formData.time"
						:options="options"
						:editable="false"
						type="datetimerange"
						split-panels
						separator=" 至 "
						format="yyyy-MM-dd HH:mm"
						style="width: 220px"
						placeholder="请选择报名时间"
						transfer
					/>
					<!-- type="daterange" -->
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Message, Select, Option, InputNumber, Input } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
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
		'i-input': Input,
	},
	props: {
		name: Number,
		datas: {
			type: Array,
			default: () => [{}, {}]
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				classes: '',
				time: [],
				number: ''
			},
			apply_id: '',
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
				number: [{ type: 'validPositive', validator: dataValidity, trigger: 'blur' }],
			},
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleChange(e) {
			this.$request({
				url: API_ROOT['_HR_TRAIN_SCHEDULE_ONLINE_GET_COURSE_CONTENT_GET'], // eslint-disable-line
				type: "GET",
				param: { course_id: e }
			}).then((res) => {
				this.formData.time = [moment(res.data.start_time).format("YYYY-MM-DD HH:mm"), moment(res.data.end_time).format("YYYY-MM-DD HH:mm")];
				this.formData.number = res.data.participator_limit ? res.data.participator_limit : '';
				this.apply_id = res.data.apply_id;
			}).catch((error) => {
				Message.error(error.msg);
			});
		},
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
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
				start_time: moment(this.formData.time[0]).format("YYYY-MM-DD HH:mm"),
				end_time: moment(this.formData.time[1]).format("YYYY-MM-DD HH:mm"),
				relation_type: 2,
				participator_limit: this.formData.number ? this.formData.number : 0,
				relation_id: [this.formData.classes],
				project_id: projectId,
				apply_id: this.apply_id
			};
			let next = true;
			if (moment(this.formData.time[0]).format('YYYY-MM-DD HH:mm')
				== moment(this.formData.time[1]).format('YYYY-MM-DD HH:mm')) {
				this.$Message.warning('报名开始时间不能等于报名结束时间');
				next = false;
			}
			if (next) { 
				this.$request({
				url: API_ROOT['_HR_TRAIN_SCHEDULE_ONLINE_SAVE_POST'], // eslint-disable-line
					type: "POST",
					param: obj
				}).then((res) => {
					Message.success('开通报名成功');
					this.visible = false;
					this.$emit('sure');
				}).catch((error) => {
					Message.error(error.msg);
					this.$refs.modal.buttonLoading = false;
				});
			} else {
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
			}
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


