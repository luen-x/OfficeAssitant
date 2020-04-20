<template>
	<i-form
		ref="form"
		:model="formValidate"
		:rules="ruleValidate"
		:label-width="100"
		class="v-hr-social-summary-info-form g-col"
		position="left"
	>
		<div class="_form">
			<oa-base
				v-model="disabled"
				:info="{
					applicant_name: info.applicant_name,
					sex: info.sex,
					age: info.age,
					editable: [0,1,2,3,4,5].indexOf(info.pass_type) === -1 && info.status !== 5 && info.status !== 7
						&& ['social-follow', 'social-statistics', 'transport', 'try-data-detail-index',
							'lecture-course-detail-index'].indexOf(list_type) === -1
				}"
				@change="handleToggle"
			/>
		</div>
		<!-- 基本信息 -->
		<div class="_form g-flex g-fw-w g-jc-sb">
			<oa-form-item
				v-if="!disabled"
				:disabled="false"
				:value="info.applicant_name"
				label="姓名"
				prop="applicant_name"
			>
				<i-input
					v-model="formValidate.applicant_name"
					:maxlength="10"
					clearable
					style="width: 300px"
					placeholder="请输入姓名"
				/>
			</oa-form-item>
			<!-- 布局原因在这里加了if判断 -->
			<oa-form-item
				v-if="!disabled"
				:disabled="false"
				:value="info.mobile"
				label="手机号码"
				prop="mobile"
			>
				<i-input
					v-model="formValidate.mobile"
					:maxlength="11"
					clearable
					style="width: 300px"
					placeholder="请输入手机号码"
				/>
			</oa-form-item>
			<oa-form-item
				v-if="!disabled"
				:disabled="false"
				:value="info.sex"
				label="性别"
				prop="sex"
			>
				<i-radio-group v-model="formValidate.sex" style="width: 300px;">
					<i-radio :label="0">男</i-radio>
					<i-radio :label="1">女</i-radio>
				</i-radio-group>
			</oa-form-item>
			<oa-form-item
				v-if="!disabled"
				:disabled="false"
				:value="info.age"
				label="年龄"
				prop="age"
			>
				<i-input-number
					v-model="formValidate.age"
					:min="0"
					:max="99"
					:precision="0"
					style="width: 300px"
					placeholder="请输入年龄"
				/>
			</oa-form-item>

			<oa-form-item
				:disabled="disabled"
				:value="info.position_name"
				label="应聘职位"
				prop="position"
			>
				<i-cascader
					v-model="formValidate.position"
					:data="recruitDePosition"
					style="width: 300px; display: inline-block"
					clearable
					filterable
					transfer
					trigger="hover"
					placeholder="请选择应聘职位"
				/>
			</oa-form-item>
			<!-- 布局原因在这里加了if判断 -->
			<oa-form-item
				v-if="disabled"
				:disabled="true"
				:value="info.mobile"
				label="手机号码"
				prop="mobile"
			>
				<i-input
					v-model="formValidate.mobile"
					style="width: 300px"
					clearable
					placeholder="请输入手机号码"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.work_time_name"
				label="工作年限"
				prop="work_time"
			>
				<i-select
					v-model="formValidate.work_time"
					style="width: 300px"
					clearable
					transfer
					placeholder="请选择工作年限"
					@on-change="handleTimeChange"
				>
					<i-option
						v-for="(item, index) in workTime"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.salary"
				label="期望薪资"
				prop="salary"
			>
				<i-input
					v-model="formValidate.salary"
					:maxlength="20"
					clearable
					style="width: 300px"
					placeholder="请输入期望薪资"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.education_name"
				label="学历"
				prop="education"
			>
				<i-select
					v-model="formValidate.education"
					style="width: 300px"
					clearable
					transfer
					placeholder="请选择学历"
				>
					<i-option
						v-for="(item, index) in education"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.native"
				label="籍贯"
				prop="region"
			>
				<i-cascader
					v-model="formValidate.region"
					:data="region"
					style="width: 300px; display: inline-block"
					clearable
					transfer
					change-on-select
					placeholder="请选择籍贯"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.now_address"
				label="现居住地"
				prop="now_address"
			>
				<i-input
					v-model="formValidate.now_address"
					:maxlength="50"
					clearable
					style="width: 300px"
					placeholder="请输入现居住地"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.ditch_name"
				label="招聘渠道"
				prop="ditch"
			>
				<i-select
					v-model="formValidate.ditch"
					style="width: 300px"
					clearable
					transfer
					placeholder="请选择招聘渠道"
				>
					<i-option
						v-for="(item, index) in ditches"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				v-if="formValidate.ditch === 22"
				:disabled="disabled"
				:value="info.introducer_name"
				label="转介绍人"
				prop="introducer_id"
			>
				<i-select
					ref="introducer"
					v-model="formValidate.introducer_id"
					:remote-method="loadIntroducer"
					:loading="introducerLoading"
					style="width: 300px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请选择转介绍人"
					@on-change="handleChange($event, 'introducer')"
					@on-query-change="handleQueryChange($event, 'introducer')"
				>
					<i-option
						v-for="(item, index) in introducerData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				v-if="formValidate.ditch == 23"
				:disabled="disabled"
				:value="info.ditch_remarks"
				label="招聘备注"
				prop="ditch_remarks"
			>
				<i-input
					v-model="formValidate.ditch_remarks"
					clearable
					style="width: 300px"
					placeholder="请输入备注"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.create_time"
				label="录入时间"
				prop="create_time"
			>
				<i-date-picker
					:value="formValidate.create_time"
					type="date"
					style="width: 300px;"
					placeholder="请选择录入时间"
					@on-change="handleChange($event, 'create_time')"
				/>
			</oa-form-item>
			<oa-form-item
				v-if="['3', '4', '5', '6', '7'].indexOf($route.query.type) > -1 && list_type !== 'transport'"
				:disabled="disabled"
				:value="info.send_offer_time"
				label="发offer时间"
				prop="send_offer_time"
			>
				<i-date-picker
					:value="formValidate.send_offer_time"
					type="date"
					style="width: 300px;"
					placeholder="发offer时间"
					@on-change="handleChange($event, 'send_offer_time')"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.invite_name"
				label="邀约人"
				prop="staff_id"
			>
				<i-select
					ref="staff"
					v-model="formValidate.staff_id"
					:remote-method="loadStaff"
					:loading="staffLoading"
					style="width: 300px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请选择邀约人"
					@on-change="handleChange($event, 'staff')"
					@on-query-change="handleQueryChange($event, 'staff')"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				v-if="disabled"
				:disabled="true"
				:value="formValidate.hr_pass_result_name"
				label="人事面试结果"
				prop="hr_pass_result_name"
			>
				<i-input
					v-model="formValidate.hr_pass_result_name"
					:maxlength="200"
					clearable
					style="width: 300px"
					placeholder="请输入人事面试结果"
				/>
			</oa-form-item>
			<!-- 是否跟踪 -->
			<oa-form-item
				v-if="disabled && $route.query.type==='1' && list_type !== 'transport'"
				:disabled="true"
				:customer="true"
				:value="info.is_tracking"
				label="是否跟进"
			>
				{{ info.is_tracking_name }}
			</oa-form-item>
			<!-- 预计面试时间 -->
			<oa-form-item
				v-if="(['2', '6', '8'].some(item => $route.query.type == item ))"
				:disabled="disabled"
				:value="info.predict_interview_time"
				prop="predict_interview_time"
				label="预计面试时间"
			>
				<i-date-picker
					:value="formValidate.predict_interview_time"
					type="datetime"
					format="yyyy-MM-dd HH:mm"
					style="width: 300px;"
					placeholder="请选择预计面试时间"
					@on-change="handleChange($event, 'predict_interview_time')"
				/>
			</oa-form-item>
			<!-- 线上简历 -->
			<oa-form-item
				v-if="disabled && (info.status != 0 || (info.pass_type && info.pass_type != 0))"
				:disabled="true"
				:customer="true"
				:value="info.resume_status"
				label="线上简历"
			>
				<router-link
					v-if="list_type !== 'transport'"
					:to="`/hr/recruit/social/resume?applicant_id=${info.applicant_id}&print=1`"
					class="g-operation"
				>
					{{ info.resume_status_name }}
				</router-link>
				<span v-else>{{ info.resume_status_name }}</span>
			</oa-form-item>
		</div>
		<!-- 试岗 -->
		<div
			v-if="[3,4,5,7].indexOf(info.status) > -1 || [3,4].indexOf(info.pass_type) > -1"
			class="_form g-flex g-fw-w g-jc-sb"
		>
			<oa-form-item
				:disabled="disabled"
				:value="`${info.try_start_time || '--'}${info.try_start_time ? '至' : ''}${info.try_end_time || ''}`"
				label="试岗时间"
			>
				<i-date-picker
					:value="[formValidate.try_start_time, formValidate.try_end_time]"
					type="daterange"
					style="width: 300px;"
					placeholder="请选择试岗时间"
					@on-change="handleChange($event, 'try_start_time')"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.try_depart_name"
				label="试岗部门"
			>
				<i-cascader
					v-model="formValidate.try_depart_array"
					:change-on-select="true"
					:data="departAll"
					disabled
					style="width: 300px; display: inline-block"
					clearable
					transfer
					trigger="click"
					placeholder="请选择试岗部门"
				/>
			</oa-form-item>
			<oa-form-item
				v-if="[4, 5, 7].some(item => item == info.status) || info.pass_type == 3 || info.pass_type == 4"
				:disabled="disabled"
				:value="info.predict_entry_time"
				label="预计入职时间"
			>
				<i-date-picker
					:value="formValidate.predict_entry_time"
					type="date"
					style="width: 300px;"
					placeholder="请选择预计入职时间"
					@on-change="handleChange($event, 'predict_entry_time')"
				/>
			</oa-form-item>

			<oa-form-item
				v-if="info.status == 5"
				:disabled="disabled"
				:value="info.entry_time"
				label="入职时间"
			>
				<i-date-picker
					:value="formValidate.entry_time"
					type="date"
					style="width: 300px;"
					placeholder="请选择入职时间"
					@on-change="handleChange($event, 'entry_time')"
				/>
			</oa-form-item>

			<oa-form-item
				v-if="disabled && (info.status == 5 || info.pass_type == 3 || info.pass_type == 4 || info.status == 7)"
				:disabled="true"
				:customer="true"
				:value="info.result_name"
				label="入职面谈单"
			>
				<span v-if="info.is_write_entry == 1" class="g-operation" @click="handleLinkTo">
					已上传
				</span>
				<span v-else>
					未上传
				</span>
			</oa-form-item>
		</div>

		<!-- 淘汰人 -->
		<div
			v-if="[0,1,2,3,4,5].indexOf(info.pass_type) > -1"
			class="_form g-flex g-fw-w g-jc-sb"
		>
			<oa-form-item
				:disabled="disabled"
				:value="formValidate.pass_staff_name"
				label="淘汰人"
			>
				<i-select
					ref="pass"
					v-model="formValidate.pass_id"
					:remote-method="loadPass"
					:loading="passLoading"
					style="width: 300px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请选择淘汰人"
					@on-change="handleChange($event, 'pass')"
					@on-query-change="handleQueryChange($event, 'pass')"
				>
					<i-option
						v-for="(staff, index) in passData"
						:key="index"
						:value="staff.value"
					>{{ staff.label }}</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="formValidate.pass_time"
				label="淘汰时间"
			>
				<i-date-picker
					:value="formValidate.pass_time"
					type="date"
					style="width: 300px;"
					placeholder="请选择淘汰时间"
					@on-change="handleChange($event, 'pass_time')"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="formValidate.pass_remarks_type_name"
				label="淘汰原因"
			>
				<oa-limit-words
					v-model="formValidate.pass_remarks_type_name"
					:max="200"
					style="width: 300px"
					placeholder="请输入淘汰原因"
				/>
			</oa-form-item>
		</div>
		<!-- 简历附件 -->
		<oa-form-item
			:disabled="disabled"
			:customer="true"
			label="简历附件"
			prop="resume"
			style="width: 400px;"
		>
			<oa-upload
				v-if="!disabled"
				v-model="formValidate.resume"
				:max="10"
				:disabled="disabled"
				style="width: 300px"
			/>
			<oa-upload
				v-if="disabled && formValidate.resume.length"
				v-model="formValidate.resume"
				:max="10"
				:disabled="disabled"
				style="width: 300px"
			/>
			<span v-if="disabled && !formValidate.resume.length">--</span>
		</oa-form-item>

		<!-- 面试记录 -->
		<div
			v-for="(item, index) in formValidate.interview"
			:key="index"
			class="_form"
		>
			<oa-interview
				:applicant-id="info.applicant_id"
				:info.sync="formValidate.interview[index]"
				:index="index"
				:prop-id="'interview.' + index + '.interviewer_id'"
				:prop-result="'interview.' + index + '.result'"
				:prop-interview="'interview.' + index + '.interview_time'"
				:rules="{
					interviewer_ids: ruleValidate.interviewer_ids,
					result: ruleValidate.ruleValidate,
					interview_time: ruleValidate.interview_time
				}"
				:disabled="disabled"
			/>
		</div>
		<!-- 离职 -->
		<oa-form-item
			v-if="info.status == 7"
			:disabled="disabled"
			:value="info.leave_time"
			label="离职时间"
		>
			<i-date-picker
				:value="formValidate.leave_time"
				type="date"
				style="width: 300px;"
				placeholder="请选择离职时间"
				@on-change="handleChange($event, 'leave_time')"
			/>
		</oa-form-item>

		<!-- 编辑状态下保存按钮 -->
		<div v-if="!disabled" class="g-flex-ac">
			<div style="width: 100px" />
			<div class="g-flex-ac">
				<div class="g-gray-btn-small g-m-r-10" @click="handleCancel">取消</div>
				<vc-debounce-click class="g-red-btn-small" @click="handleSave">保存</vc-debounce-click>
			</div>
		</div>
	</i-form>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio,
	Select, Option, DatePicker, Cascader, Message
} from 'iview';
import Upload from '@components/_common/upload/upload';
import LimitWords from '@components/_common/limit-words/limit-words';
import { services, createSearch, inviteType, workTime } from '@stores/services/hr';
import { services as commonServices } from '@stores/services/common';
import { dataValidity, formatMoment, getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
// components
import { timingSafeEqual } from 'crypto';
import Base from './form/base';
import OAFormItem from './form/form-item';
import Interview from './form/interview';

export default {
	name: 'oa-hr-social-summary-info-form',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-base': Base,
		'oa-form-item': OAFormItem,
		'oa-upload': Upload,
		'oa-interview': Interview,
		'oa-limit-words': LimitWords,
	},
	mixins: [
		services.departAll(),
		services.recruitDePosition(),
		services.education(),
		services.ditches(),
		commonServices.region(),
		workTime,
		createSearch({ key: 'introducer' }),
		createSearch({ key: 'staff' }),
		createSearch({ key: 'pass' })
	],
	props: {
		info: {
			type: Object,
			default() {
				return {};
			}
		},
		onRefresh: Function,
		toggle: Function
	},
	data() {
		const { query } = getParseUrl();
		let validateDate = (rule, value, callback) => {
			if (!value[0] || !value[1]) {
				callback(new Error("请选择试岗时间"));
			} else { callback(); }
		};
		return {
			disabled: true,
			list_type: query.list_type,
			
			formValidate: {
				...this.info,
				resume: this.formatResume(this.info.resume),
				age: Number(this.info.age) || null,
				region: [this.info.province, this.info.city].filter(Boolean),
				position: [this.info.depart_id, this.info.position_id].filter(Boolean),
				introducer_name: this.info.introducer_name,
				staff_name: this.info.invite_name,
				pass_id: this.info.pass_staff,
				pass_name: this.info.pass_staff_name,
			},
			ruleValidate: {
				applicant_name: [
					{ required: true, message: '请输入姓名' },
					{ type: 'validCompellation', validator: dataValidity }
				],
				sex: [
					{ required: true, message: '请选择性别' }
				],
				mobile: [
					{ required: true, message: '请输入手机号码', trigger: 'blur' },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity }
				],
				position: [
					{ required: true, type: 'array', message: '请输入应聘职位' }
				],
				salary: [
					// { required: true, message: '请输入期望薪资' }
				],
				education: [
					{ required: true, type: 'number', message: '请选择学历' }
				],
				ditch: [
					{ required: true, type: 'number', message: '请选择招聘渠道' }
				],
				introducer_id: [
					{ required: true, type: 'number', message: '请选择转介绍人' }
				],
				now_address: [
					// { type: 'validName', validator: dataValidity }
				],
				try_start_time: [
					{ required: true, type: 'array', message: '请选择试岗时间', trigger: 'change' },
					{ validator: validateDate, trigger: 'change' }
				],
				interview_time: [
					{ required: true, message: '请选择实际面试时间' }
				],
				predict_interview_time: [
					{ required: true, message: '请选择预计面试时间' }
				],
				interviewer_id: [
					// { required: true, type: 'number', message: '请选择面试官' }
				],
				staff_id: [
					{ required: true, type: 'number', message: '请选择邀约人' }
				],
				result: [
					{ required: true, type: 'number', message: '请选择面试结果' }
				],

			}
		};
	},
	mounted() {
		// 初始化远程搜索框
		this.introducer = this.info.introducer_name;
		this.staff = this.info.invite_name;
		this.pass = this.info.pass_staff_name;
	},
	methods: {
		handleQueryChange(query = '', type) {
			let targetQuery = this.formValidate[`${type}_name`] || '';
			if (targetQuery.length > query.length) {
				this.$refs[`${type}`].clearSingleSelect();
			}
		},
		handleToggle() {
			this.toggle && this.toggle('edit');
			if (this.formValidate.ditch === 22) {
				this.introducerData = [];
				this.loadIntroducer(this.info.introducer_name);
			}
		},
		handleLinkTo() {
			// let url = this.info.url ? this.info.url.pc.split('.com') : '';
			// url ? this.$router.push(`${url[1]}`) : null;
			let params = {};
			let paramsArr = this.info.url.pc.split('?')[1].split('&');
			paramsArr.forEach(it => {
				params[it.split('=')[0]] = it.split('=')[1];
			});
			this.$router.push(getHashUrl('/hr/recruit/social/summary/entry', {
				...params,
				recruitType: 'social'
			}));
		},
		handleChange(value, type) {
			this.formValidate[type] = value;
			if (type === 'staff' || type === 'pass') {
				this.formValidate[`${type}_id`] = value && value.value ? value.value : '';
				this.formValidate[`${type}_name`] = value && value.label ? value.label : '';
			}
			if (type === 'introducer') {
				this.formValidate[`${type}_id`] = value && String(value.value) ? value.value : '';
				this.formValidate[`${type}_name`] = value && value.label ? value.label : '';
			}
			if (type === 'try_start_time') {
				this.formValidate.try_start_time = value[0];
				this.formValidate.try_end_time = value[1];
			}
		},
		handleTimeChange(v) {
			if (v == undefined) {
				this.formValidate.work_time = 6;
			}
		},
		formatResume(resume = []) {
			return resume.map((item) => {
				return {
					type: item.type,
					title: item.title,
					url: item.url,
					uid: item.uid,
					percent: 100
				};
			});
		},
		handleCancel() {
			this.disabled = true;
			this.toggle && this.toggle('look');
			this.formValidate = {
				...this.info,
				predict_entry_time: this.info.predict_entry_time || null,
				create_time: this.info.create_time || null,
				resume: this.formatResume(this.info.resume),
				age: Number(this.info.age) || null,
				region: [this.info.province, this.info.city],
				position: [this.info.depart_id, this.info.position_id]
			};
		},
		handleSave() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					let values = {
						...this.formValidate,
						depart_id: this.formValidate.position[0],
						position_id: this.formValidate.position[1],
						province: this.formValidate.region[0] || 0,
						city: this.formValidate.region[1] || 0,
						try_depart_id: this.formValidate.try_depart_array.length ? this.formValidate.try_depart_array.pop() : '',
						pass_staff: this.formValidate.pass_id
					};
					delete values.position;
					delete values.region;
					delete values.try_depart_array;
					this.$request({
						url: API_ROOT['_HR_RECRUIT_SUMMARY_ADD_POST'], // eslint-disable-line
						type: "POST",
						param: {
							applicant_id: this.$route.params.id,
							...values
						}
					}).then((res) => {
						this.onRefresh && this.onRefresh(true);
						this.toggle && this.toggle('look');
					}).catch((error) => {
						this.$Message.error(error.msg);
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.v-hr-social-summary-info-form {
	height: inherit;
	overflow-y: auto;
	border-right: 1px solid #d9dce0;
	padding-right: 40px;
	._form {
		.ivu-radio-wrapper:first-child {
			margin-right: 50px;
		}
		.__title {
			font-size: 14px;
			color: #333333;
			padding-left: 10px;
			border-left: 2px solid #e84854;
			line-height: 14px;
		}
	}
}
</style>


