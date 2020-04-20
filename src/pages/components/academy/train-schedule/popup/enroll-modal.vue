<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:title="edit ? '编辑课程' : '添加课程'"
			:width="680"
			:mask-closable="false"
			class="v-collage-main-schedule-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item label="课程大类:" prop="course_type">
					<i-radio-group v-model="formData.option" :style="{ width: '80%' }">
						<i-radio :label="1">不设条件</i-radio>
						<i-radio :label="2">设置报名条件</i-radio>
					</i-radio-group>
				</i-form-item>
				<!-- 大课培训 -->
				<i-form-item v-if="formData.option == 2" label="" prop="activity_id">
					<i-checkbox v-model="formData.age_range">
						工龄范围
						<span style="color: #999999">（当前工龄要求，精确到月）</span>
					</i-checkbox>
				</i-form-item>
				<i-form-item v-if="formData.option == 2 && formData.age_range" label="" prop="age">
					在
					<i-input-number 
						v-model="formData.age.age_min" 
						:precision="0"
						placeholder="输入最小值(整数)"
						style="width: 120px;"
					/>
					-
					<i-input-number 
						v-model="formData.age.age_max" 
						:precision="0"
						placeholder="输入最大值(整数)"
						style="width: 120px;"
					/>
				</i-form-item>
				<i-form-item v-if="formData.option == 2" label="" prop="activity_id">
					<i-checkbox v-model="formData.depart_name_single">
						职位
						<span style="color: #999999">（当前职位要求）</span>
					</i-checkbox>
				</i-form-item>
				<i-form-item v-if="formData.option == 2 && formData.depart_name_single" label="" prop="activity_id">
					当前所处
					<i-select
						v-model="formData.depart_name"
						style="width: 220px"
						clearable
						transfer
						multiple
						placeholder="选择职位（可多选）"
					>
						<i-option
							v-for="(item, index) in departList"
							:key="index"
							:value="item.depart_id"
						>
							{{ item.depart_name }}
						</i-option>
					</i-select>
					（可多选）
				</i-form-item>
				<i-form-item 
					label="报名时间：" 
					prop="course_name"
				>
					<i-datepicker
						v-model="formData.time"
						:options="options"
						:editable="false"
						type="daterange"
						split-panels
						separator=" 至 "
						format="yyyy-MM-dd"
						style="width: 220px"
						placeholder="请选择往返日期"
						transfer
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Message, Select,
	Radio, RadioGroup, Option, Cascader, InputNumber, Input, Checkbox } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';
import { setTimeout } from 'timers';

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
		datas: {
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
			formData: {
				option: 1,
				time: null,
				age_range: false,
				depart_name_single: false,
				age: {
					age_min: null,
					age_max: null,
				},
				depart_name: []
			},
			formdataRule: {
			},
			departList: [
				{
					depart_id: 1,
					depart_name: '什么'
				}
			],
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
	},
	methods: {

		// 线下课程详情
		loadInfo() {

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