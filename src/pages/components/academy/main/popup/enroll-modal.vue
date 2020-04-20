<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:title="edit ? '编辑报名' : '开通报名'"
			:width="680"
			:mask-closable="false"
			class="v-academy-enroll-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form"
				:model="formData"
				:label-width="100"
				:rules="formdataRule"
				class="g-m-t-20 g-pd-l-10 _form"
				style="padding-left: 120px;"
			>
				<div class="__item">
					<i-form-item label="课程大类:" prop="course_type">
						<i-radio-group v-model="formData.has_condition" :style="{ width: '80%' }">
							<i-radio :label="0">不设条件</i-radio>
							<i-radio :label="1">设置报名条件</i-radio>
						</i-radio-group>
					</i-form-item>
					<!-- 大课培训 -->
					<i-form-item v-if="formData.has_condition == 1" label="" prop="activity_id">
						<i-checkbox v-model="formData.age_range">
							工龄范围
							<span style="color: #999999">（当前工龄要求，精确到月）</span>
						</i-checkbox>
					</i-form-item>
					<i-form-item v-if="formData.has_condition == 1 && formData.age_range" label="" prop="age">
						在
						<i-input-number
							v-model="formData.age.workage_start"
							:precision="0"
							:min="0"
							:max="999"
							placeholder="输入最小值(整数)"
							style="width: 120px;"
						/>
						-
						<i-input-number
							v-model="formData.age.workage_stop"
							:precision="0"
							:min="0"
							:max="999"
							placeholder="输入最大值(整数)"
							style="width: 120px;"
						/>
					</i-form-item>
					<i-form-item v-if="formData.has_condition == 1" label="" prop="activity_id">
						<i-checkbox v-model="formData.depart_name_single">
							职位
							<span style="color: #999999">（当前职位要求）</span>
						</i-checkbox>
					</i-form-item>
				</div>
				<i-form-item v-if="formData.has_condition == 1 && formData.depart_name_single" label="" prop="activity_id">
					当前所处
					<i-select
						v-model="formData.position"
						style="width: 220px"
						clearable
						transfer
						multiple
						placeholder="选择职位（可多选）"
					>
						<i-option
							v-for="(item, index) in positionList"
							:key="index"
							:value="item.position_id"
						>
							{{ item.position_name }}
						</i-option>
					</i-select>
					（可多选）
				</i-form-item>
				<i-form-item
					label="报名时间："
					prop="time"
				>
					<i-datepicker
						v-model="formData.time"
						:options="options"
						:editable="false"
						type="datetimerange"
						split-panels
						separator=" 至 "
						format="yyyy-MM-dd HH:mm"
						style="width: 300px"
						placeholder="请选择报名时间"
						transfer
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { Modal, DatePicker, Form, FormItem, Message, Select,
	Radio, RadioGroup, Option, Cascader, InputNumber, Input, Checkbox } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { CreatePortal } from 'wya-vc';
import { dataValidity, getItem, setItem } from '@utils/utils';
import moment from 'moment';
import { setTimeout } from 'timers';
import { Confirm } from "@components/_common/confirm/confirm";

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
		'i-cascader': Cascader,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-checkbox': Checkbox
	},
	mixins: [
		commonServices.region()
	],
	props: {
		name: Number,
		data: {
			type: Object,
			default: () => {}
		},
		edit: {
			type: Number,
			default: 0
		},
		calendar_id: Number
	},
	data() {
		return {
			visible: false,
			course_staff_condition_id: '',
			course_id: '',
			formData: {
				has_condition: 0,
				time: null,
				age_range: false,
				depart_name_single: false,
				age: {
					workage_start: null,
					workage_stop: null,
				},
				position: []
			},
			formdataRule: {
				time: [{
					type: 'array',
					required: true,
					fields: {
						0: { type: 'date', required: true, message: '请选择开始时间' },
						1: [{ type: 'date', required: true, message: '请选择结束时间' }
						],
					}
				}],
			},
			positionList: [],
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
		};
	},
	watch: {
	},
	mounted() {
		this.visible = true;
		this.loadPosition();
		this.initData();
	},
	methods: {
		initData() {
			if (!Array.isArray(this.data.applyCondition)) {
				this.course_staff_condition_id = this.data.applyCondition.course_staff_condition_id;
				this.course_id = this.data.applyCondition.course_id;
				this.formData.time = [this.data.applyCondition.start_time, this.data.applyCondition.stop_time];
				this.formData.has_condition = this.data.applyCondition.has_condition;
				this.formData.age.workage_start = this.data.applyCondition.workage_start || null;
				this.formData.age.workage_stop = this.data.applyCondition.workage_stop || null;
				if (this.data.applyCondition.workage_start || this.data.applyCondition.workage_stop) {
					this.formData.age_range = true;
				}
				this.data.applyCondition.position.length ? this.formData.depart_name_single = true : '';
				this.formData.position = this.data.applyCondition.position.map(Number);
			}
		},
		loadPosition() {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then((res) => {
				let depart = getItem("firstDepartId_" + _global.version, 'localStorage');
				this.positionList = res.data.filter(item => item.depart_id === depart.res.data.sale)[0].positions;
			}).catch((error) => {});
		},

		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					if (this.formData.age_range && this.formData.age.workage_stop !== null
					&& (this.formData.age.workage_start > this.formData.age.workage_stop)) {
						this.$Message.warning('工龄最小值不能大于最大值');
						this.$refs.modal.buttonLoading = false;
					} else if (this.formData.has_condition == 1 && !this.formData.age_range && !this.formData.depart_name_single) {
						this.$Message.warning('请设置条件');
						this.$refs.modal.buttonLoading = false;
					} else if (this.formData.age_range && (!this.formData.age.workage_start && !this.formData.age.workage_stop)) {
						this.$Message.warning('请设置条件');
						this.$refs.modal.buttonLoading = false;
					} else if (this.formData.depart_name_single && !this.formData.position.length) {
						this.$Message.warning('请设置条件');
						this.$refs.modal.buttonLoading = false;
					} else {
						this.visible = false;
						if (!this.formData.has_condition) {
							Confirm.popup({ title: '提示', msg: '确定不设置任何报名条件开通报名吗？', showIcon: true })
								.then((res) => {
									this.handleSave();
								})
								.catch(() => {
									this.visible = true;
								});
						} else {
							this.handleSave();
						}
					}
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			let obj = {
				course_id: this.data.course_id,
				start_time: moment(this.formData.time[0]).format('YYYY-MM-DD HH:mm'),
				stop_time: moment(this.formData.time[1]).format('YYYY-MM-DD HH:mm'),
				has_condition: this.formData.has_condition
			};
			if (this.formData.age_range) {
				obj.workage_start = this.formData.age.workage_start;
				obj.workage_stop = this.formData.age.workage_stop;
			}
			this.formData.depart_name_single ? obj.position = this.formData.position : '';
			this.$request({
				url: API_ROOT._ACADEMY_MAIN_SCHEDULE_COURSE_ENROLL_ADD_POST,
				type: 'POST',
				param: obj,
				loading: false
			}).then((res) => {
				this.$emit('sure');
			}).catch((error) => {});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const EnrollModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-enroll-modal {
	._form {
		.__item {
			.ivu-form-item {
				margin-bottom: 10px !important;
			}
		}
	}
}
</style>