<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title"
		width="400px"
		class="v-collage-add-edit-lesson-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-12 g-c-black2">
			<i-form
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="110"
				@submit.native.prevent
			>
				<i-form-item
					v-if="reject_reason"
					label="驳回理由："
				>
					<div>
						<oa-autotip
							:content="reject_reason || '--'"
							placement="bottom" 
							label-class=" "
						/>
					</div>
				</i-form-item>

				<i-form-item
					label="活动类型："
					prop="lecture_set_id"
				>
					<i-select
						v-model="formValidate.lecture_set_id"
						clearable
						transfer
						style="width: 220px"
						placeholder="请选择活动类型"
						@on-change="handleActivityChange"
					>
						<i-option
							v-for="item in activityCategory"
							:key="item.lecture_set_id"
							:value="item.lecture_set_id">{{ item.name }}</i-option>
					</i-select>
				</i-form-item>

				<i-form-item
					v-if="$auth[1408] && !open_lesson_id"
					label="录单人"
					prop="staff_id"
				>
					<i-select
						ref="staff"
						:remote-method="loadStaff"
						:loading="staffLoading"
						:value="formValidate.staff_id"
						filterable
						clearable
						transfer
						remote
						label-in-value
						placeholder="请输入员工姓名手机"
						style="display: inline-block; width: 220px"
						class="g-m-r-5"
						@on-change="handleStaffChange"
						@on-query-change="handleQueryChange"
					>
						<i-option 
							v-for="(option, index) in staffData" 
							:value="option.value" 
							:key="index"
						>{{ option.label }}
						</i-option>
					</i-select>

				</i-form-item>

				<i-form-item
					v-if="formValidate.lecture_set_id"
					label="担任角色："
					prop="role_type"
				>
					<i-select
						v-model="formValidate.role_type"
						clearable
						transfer
						style="width: 220px"
						placeholder="请选择担任角色"
						@on-change="handleRoleChange"
					>
						<i-option
							v-for="role of roleList"
							:key="role.role_type"
							:value="role.role_type">{{ role.role_type_name }}</i-option>
					</i-select>
				</i-form-item>

				<i-form-item
					v-if="roleKeyList.includes(11) && nowActivityDetail.is_auditorium != 1"
					label="活动名称："
					prop="lesson_id"
				>
					<i-select
						v-model="formValidate.lesson_id"
						:loading="activityLoading"
						:remote-method="loadActivityNameData"
						clearable
						remote
						transfer
						filterable
						style="width: 220px"
						placeholder="请选择活动名称"
					>
						<i-option
							v-for="item in cacheActivityName"
							:key="item.activity_id"
							:value="+item.activity_id">{{ item.activity_name }}</i-option>
					</i-select>
				</i-form-item>

				<!-- <i-form-item
					v-if="roleKeyList.includes(11) && nowActivityDetail.is_auditorium != 1"
					label="活动名称："
					prop="lesson_id"
				>
					<i-select
						v-model="formValidate.lesson_id"
						clearable
						remote
						filterable
						transfer
						:remote-method="handleSearchActivity"
						:loading="searchLoading"
						style="width: 220px"
						placeholder="请选择活动名称"
					>
						<i-option
							v-for="item in cacheActivityName[formValidate.lecture_set_id]"
							:key="item.activity_id"
							:value="+item.activity_id">{{ item.activity_name }}</i-option>
					</i-select>
				</i-form-item> -->


				<i-form-item
					v-if="roleKeyList.includes(3) && nowActivityDetail.is_auditorium == 1"
					label="课程名称："
					prop="lesson_name"
				>
					<i-input
						v-model="formValidate.lesson_name"
						:maxlength="15"
						clearable
						placeholder="请输入课程名称"
						style="width: 220px"
					/>
				</i-form-item>

				<i-form-item 
					v-if="roleKeyList.includes(4)"
					prop="join_time" 
					label="参与日期：">
					<i-data-picker 
						v-model="formValidate.join_time"
						:options="options"
						format="yyyy-MM-dd"
						type="daterange"
						split-panels
						transfer
						separator=" 至 "
						style="width: 220px;"
						placeholder="请选择参与日期"/>
				</i-form-item>

				<i-form-item 
					v-if="roleKeyList.includes(5)"
					prop="join_day" 
					label="参与天数："
				>
					<i-input-number
						v-model="formValidate.join_day" 
						:min="0"
						:precision="0"
						:max="9"
						clearable
						style="width: 220px"
						placeholder="请输入参与天数"
					/>
					<span 
						class="g-c-black2 g-absolute __tip">天</span>
				</i-form-item>
				
				<div v-if="roleKeyList.includes(6)">
					<i-form-item 
						prop="lecturer_hour" 
						label="讲课时长："
						class="__hour"
					>
						<i-input-number
							v-model="formValidate.lecturer_hour" 
							:min="0"
							:precision="0"
							:max="99"
							clearable
							style="width: 75px"
							placeholder="请输入小时"
						/>
						<span>小时</span>
					</i-form-item>

					<i-form-item
						prop="lecturer_minute" 
						class="__minute"
					>
						<i-input-number
							v-model="formValidate.lecturer_minute" 
							:min="0"
							:precision="0"
							:max="59"
							clearable
							style="width: 75px"
							placeholder="请输入分钟"
						/>
						<span>分钟</span>
					</i-form-item>
				</div>

				<i-form-item
					v-if="roleKeyList.includes(7)"
					label="课程主题："
					prop="lesson_subject"
				>
					<i-input
						v-model="formValidate.lesson_subject"
						:maxlength="15"
						clearable
						placeholder="请输入课程主题"
						style="width: 220px"
					/>
				</i-form-item>

				<!-- <i-form-item
					v-if="roleKeyList.includes(9)"
					label="培训主题："
					prop="training_subject"
				>
					<i-input
						v-model="formValidate.training_subject"
						:maxlength="15"
						clearable
						placeholder="请输入培训主题："
						style="width: 220px"
					/>
				</i-form-item> -->

				<!-- <i-form-item 
					v-if="roleKeyList.includes(8)"
					prop="training_time" 
					label="培训时间：">
					<i-data-picker 
						v-model="formValidate.training_time"
						format="yyyy-MM-dd HH:mm"
						type="datetime"
						transfer
						style="width: 220px;"
						placeholder="请选择培训时间"/>
				</i-form-item> -->

				<i-form-item 
					v-if="roleKeyList.includes(10)"
					label="备注："
					prop="remark">
					<oa-limit-words
						v-model="formValidate.remark" 
						:max="200" 
						width="220px"
						placeholder="请输入备注"
					/>
				</i-form-item>

			</i-form>
		</div>
	</i-modal>
</template>

<script>

/**  
 * 编辑录单和新增录单
 * 
 */

import { Modal, Button, Form, FormItem, Input, DatePicker,
	Select, Option, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import { staffByNameOrPhone, services } from '@stores/services/hr'; // 从人事部门接口获取部门级联
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";
import { FORM_KEY } from '../constants';

const initFormValidate = {
	lecture_set_id: '',
	role_type: '',
	lesson_id: '',
	lesson_name: '',
	join_time: [],
	join_day: null,
	lecturer_hour: 0,
	lecturer_minute: 0,
	lesson_subject: '',
	// training_subject: '',
	// training_time: '',
	remark: '',
	staff_id: ''
};

export default {
	name: "oa-hr-collage-online-teacher-modal",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-data-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'oa-autotip': AutoToolTip,
	},
	mixins: [staffByNameOrPhone],
	props: {
		open_lesson_id: {
			type: Number | String,
		},
		lecture_set_id: {
			type: Number | String,
		},
		title: {
			type: String
		}
	},
	data() {
		const validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择时间');
			} else {
				callback();
			}
		};
		this.options = {
			disabledDate(date) {
				// return date && date.valueOf() > Date.now() - 86400000;
				return date && date.valueOf() > Date.now();
			}
		};
		return {
			visible: false,
			activityLoading: false,
			activityCategory: [],
			cacheActivityName: [],
			roleKeyList: [],
			roleList: [],
			reject_reason: '',
			staffLoading: false,
			formValidate: {
				...initFormValidate
			},
			ruleValidate: {
				staff_id: [{ required: true, type: 'number', message: '请填写录单人', trigger: 'change' }],
				lecture_set_id: [{ required: true, type: 'number', message: '请选择活动类型', trigger: 'change' }],
				role_type: [{ required: true, type: 'number', message: '请选择角色', trigger: 'change' }],
				lesson_id: [{ required: true, type: 'number', message: '请选择活动名称', trigger: 'blur' }],
				lesson_name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
				join_time: [{ validator: validateCreatedTime, trigger: 'change', required: true, message: '请选择时间' }],
				join_day: [{ type: 'number', message: '请输入参与天数', required: true, trigger: 'blur' }],
				lecturer_hour: [{ type: 'number', message: '请输入小时', required: true, trigger: 'blur' }],
				lecturer_minute: [{ type: 'number', message: '请输入分钟', required: true, trigger: 'blur' }],
				lesson_subject: [{ required: true, message: '请输入课程主题', trigger: 'blur' }],
				// training_subject: [{ required: true, message: '请输入培训主题', trigger: 'blur' }],
				training_time: [{ message: '请选择培训时间', required: true, trigger: 'change', type: 'date' }],
			}
		};
	},
	computed: {
		nowActivityDetail() {
			return this.handleNowActivityDetail();
		}
	},
	async created() {
		await this.loadActivityCategoryData();
		if (this.open_lesson_id) {
			this.formValidate.lecture_set_id = this.lecture_set_id;
			this.loadRoleData();
			this.loadLessonData();
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		async loadLessonData() {
			this.$request({
				url: API_ROOT['_COLLEAGE_RECORD_LESSON_DETAIL_EDIT_GET'],
				type: "GET",
				param: {
					open_lesson_id: this.open_lesson_id
				}
			}).then(({ data: { field_key, record_field } }) => {
				this.roleKeyList = field_key;
				this.reject_reason = record_field.reject_reason;
				this.handleInitFormValidate(record_field);
			});
		},

		async loadActivityCategoryData() {
			try {
				const { data } = await this.$request({
					url: API_ROOT._COLLEAGE_RECORD_LESSON_LECTURE_LIST,
					type: "GET",
					param: { type: 3 }
				});
				this.activityCategory = data;
			} catch (err) {
				this.$Message.error(err);
			}
		},

		async loadRoleData() {
			try {
				const { data } = await this.$request({
					url: '_COLLEAGE_RECORD_LESSON_LESSON_ROLE_GET',
					param: { lecture_set_id: this.formValidate.lecture_set_id },
					type: "GET"
				});
				this.roleList = data;
			} catch (err) {
				this.$Message.error(err);
			}
		},

		handleActivityChange() {
			if (!this.formValidate.lecture_set_id) {
				return;
			}

			this.loadRoleData();
			this.loadRoleKeyList();
			if (this.roleKeyList.includes(11)) {
				this.formValidate.lesson_id = '';
				this.loadActivityNameData();
			}
		},

		handleRoleChange() {
			const { role_type } = this.formValidate;
			role_type ? this.loadRoleKeyList() : this.roleKeyList = [];
		},

		loadActivityNameData(query = '') {
			this.activityLoading = true;
			this.$request({
				url: API_ROOT._COLLEAGE_RECORD_ACTIVITY_LOOK_GET,
				type: "GET",
				param: {
					id: this.handleNowActivityDetail().relation_id,
					activity_name: query
				},
				loading: false
			}).then(({ data }) => {
				this.cacheActivityName = data;
			}).finally(() => {
				this.activityLoading = false;
			});
		},
		
		loadRoleKeyList() {
			const {
				lecture_set_id, role_type
			} = this.formValidate;
			lecture_set_id && role_type && this.$request({
				url: API_ROOT['_COLLEAGE_RECORD_LESSON_FIELD_GET'],
				type: "GET",
				param: {
					lecture_set_id,
					role_type,
					type: this.handleNowActivityDetail().is_auditorium
				}
			}).then(({ data }) => {
				this.roleKeyList = data;
			}).catch(err => {});
		},

		handleInitFormValidate(record_field) {
			this.roleKeyList.forEach(field => {
				const key = FORM_KEY[field];

				// lecturer_hour单独处理
				if (key === 'lecturer_hour') {
					const hour = Math.floor(record_field.lecturer_hour / 60) || 0;
					const minute = record_field.lecturer_hour % 60 || 0;
					this.formValidate.lecturer_hour = hour;
					this.formValidate.lecturer_minute = minute;
				} else {
					this.formValidate[key] = record_field[key];
				}
			});
			this.roleKeyList.includes(11) 
				&& this.loadActivityNameData(this.open_lesson_id ? record_field.lesson_name : '');
		},
		handleNowActivityDetail() {
			return this.activityCategory
				.filter(v => v.lecture_set_id == this.formValidate.lecture_set_id)[0] || {};
		},
		handleNowActivityName() {
			return this.cacheActivityName
				.filter(v => v.activity_id === this.formValidate.lesson_id)[0]
				.activity_name;
		},
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT._COLLEAGE_RECORD_LESSON_SAVE_LESSON_POST,
						type: "POST",
						param: {
							...this.handleFormatFormvalidate()
						}
					}).then(() => {
						this.$emit("sure", true);
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} else {
					this.visible = true;
				}
			});
		},
		handleFormatFormvalidate() {
			return ({
				[this.open_lesson_id && 'open_lesson_id']: this.open_lesson_id,
				record_field: this.roleKeyList.join(','),
				...this.formValidate,
				join_day: +this.formValidate.join_day,
				lecturer_hour: this.formValidate.lecturer_hour * 60 + this.formValidate.lecturer_minute,
				lesson_name: this.roleKeyList.includes(3) && this.handleNowActivityDetail().is_auditorium == 1
					? this.formValidate.lesson_name
					: this.handleNowActivityName(),
				lesson_id: this.roleKeyList.includes(11) && this.handleNowActivityDetail().is_auditorium != 1
					? this.formValidate.lesson_id
					: 0,
				join_time: this.roleKeyList.includes(4) && [
					moment(this.formValidate.join_time[0]).format('YYYY-MM-DD'),
					moment(this.formValidate.join_time[1]).format('YYYY-MM-DD')
				]
			});
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
		handleQueryChange(query = '') {
			let targetQuery = this.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		handleStaffChange(staff = {}) {
			this.formValidate.staff_id = staff.value || '';
			this.staff_name = (staff.label || '').trim();
		}
	}
};
export const EditAndAddLesson = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-add-edit-lesson-modal {
    .ivu-modal-body {
        max-height: 400px;
        overflow: auto;
    }
	.__hour,
	.__minute {
		display: inline-block;
	}
	.__minute {
		margin-left: -100px
	}
    .__tip {
        top: 2px;
		left: 200px;
		width: 19px;
		height: 20px;
		background: #fff;
	}
    .ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>

