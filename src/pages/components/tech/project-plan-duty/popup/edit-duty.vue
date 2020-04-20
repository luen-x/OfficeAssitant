<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="编辑排班"
		width="400px"
		class="v-tech-edit-duty-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-12 g-c-black2">
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100"
				@submit.native.prevent>

				<i-form-item 
					prop="project_id"
					label="项目名称：">
					<i-select 
						v-model="formValidate.project_id"
						placeholder="请选择项目"
						clearable
						style="width: 220px">
						<i-option 
							v-for="{ project_name, project_id } of projectList"
							:value="project_id"
							:key="project_id"
						>{{ project_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item 
					prop="duty_time"
					label="排班日期：">
					<i-data-picker 
						v-model="formValidate.duty_time"
						:options="options"
						type="daterange"
						split-panels
						transfer
						clearable
						separator=" 至 "
						style="width: 220px;"
						placeholder="请选择排班日期"/>
				</i-form-item>

				<i-form-item 
					v-for="(person, i) in formValidate.schedule_staff"
					:key="i"
					:prop="'schedule_staff.' + i + '.staff_name'"
					:maxlength="10"
					:label="`周${ENUM_DAY[i]}值班`">
					<i-input
						v-model="formValidate.schedule_staff[i].staff_name"
						:maxlength="10"
						clearable
						placeholder="请填写值班人"
						style="width: 220px"
					/>
				</i-form-item>
				
			</i-form>
		</div>
	</i-modal>
</template>

<script>

import { Modal, Button, Form, FormItem, Input, DatePicker, Select, Option } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import { Confirm } from "@components/_common/confirm/confirm";

const ENUM_DAY = ['一', '二', '三', '四', '五', '六', '日'];

export default {
	name: "oa-hr-collage-online-teacher-modal",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-data-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
	},
	props: {
		projectList: {
			type: Array,
			required: true
		},
	},
	data() {
		const validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择时间');
			} else {
				callback();
			}
		};
		return {
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			visible: false,
			ENUM_DAY,
			formValidate: {
				project_id: '',
				duty_time: [null, null],
				schedule_staff: new Array(7).fill().map(() => ({ staff_name: '' })),
			},
			ruleValidate: {
				project_id: [{ required: true, type: 'number', message: '请选择项目名称', trigger: 'change' }],
				duty_time: [{ required: true, validator: validateCreatedTime, message: '请选择对接时间', trigger: 'change' }],
				business_day: [{ required: true, type: 'number', message: '请输入出差天数', trigger: 'blur' }],
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					Confirm.popup({
						title: "温馨提示",
						msg: "排班后会直接覆盖排班日期内的数据，是否确定？",
					}).then(() => {
						return this.handleAddSchedule();
					}).then((res) => {
						this.$Message.success(res.msg);
						this.$emit("sure");
					}).catch(() => {
						// this.$Message.error('失败');
					});
				} else {
					this.visible = true;
				}
			});
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
		handleAddSchedule() {
			const {
				project_id,
				duty_time: [schedule_date_start, schedule_date_end],
				schedule_staff
			} = this.formValidate;
			return this.$request({
				url: '_TECH_PROJECT_PLAN_DUTY_EDIT_SCHEDULE_POST',
				type: "POST",
				param: { 
					project_id,
					schedule_date_start,
					schedule_date_end,
					schedule_staff
				}
			});
		}
	}
};
export const EditDutyModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-outline-help-leader-modal {
    .ivu-modal-body {
        max-height: 400px;
        overflow: auto;
    }
    .__tip {
        top: 3px;
		left: 276px;
		width: 22px;
		height: 20px;
		background: #fff;
	}
    .ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>

