<template>
	<div class="v-hr-recruit-detail-edit">
		<i-form
			ref="infoForm"
			:model="infoForm"
			:rules="infoRule"
			:label-width="120"
			class="g-flex g-fw-w g-jc-sb">
			<div class="_label-item g-flex">
				<i-form-item label="面试官：" prop="interviewer_id">
					<i-select
						ref="interviewer"
						v-model="infoForm.interviewer_id"
						:remote-method="loadInterviewer"
						:loading="interviewerLoading"
						style="width: 300px;"
						filterable
						remote
						clearable
						transfer
						label-in-value
						placeholder="请选择面试官"
						@on-change="handleChange"
						@on-query-change="handleQueryChange"
					>
						<i-option
							v-for="(item, index) in interviewerData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="面试时间：" prop="interview_time">
					<i-date-picker
						v-model="infoForm.interview_time"
						type="datetime"
						transfer
						clearable
						placeholder="请选择面试时间"
						style="width: 300px; "/>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item
					label="姓名："
					prop="applicant_name"
					class="g-fs-14">
					<i-input
						v-model="infoForm.applicant_name"
						:maxlength="10"
						clearable
						placeholder="请输入姓名"/>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="手机号码：" prop="mobile">
					<i-input
						v-model="infoForm.mobile"
						:maxlength="11"
						clearable
						placeholder="请输入手机号码"/>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="性别：" prop="sex">
					<i-radio-group v-model="infoForm.sex" class="g-flex g-jc-sa">
						<div class="g-flex">
							<div>
								<i-radio :label="0">男</i-radio>
							</div>
							<div>
								<i-radio :label="1">女</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="应聘职位：" prop="position_id">
					<i-cascader
						v-model="infoForm.position_id"
						:data="recruitDePosition"
						clearable
						filterable
						transfer
						trigger="hover"
						style="width: 300px"
						placeholder="请选择应聘职位"
					/>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="备选职位：" prop="alternative_position_id">
					<i-cascader
						v-model="infoForm.alternative_position_id"
						:data="recruitDePosition"
						clearable
						transfer
						trigger="hover"
						style="width: 300px"
						placeholder="请选择备选职位"
					/>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="毕业学校：" prop="college">
					<i-input
						v-model="infoForm.college"
						:maxlength="55"
						clearable
						placeholder="请输入毕业学校"/>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="专业：" prop="profession">
					<i-input
						v-model="infoForm.profession"
						:maxlength="20"
						clearable
						placeholder="请输入专业"/>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="学历：" prop="education">
					<i-select
						v-model="infoForm.education"
						clearable
						transfer
						placeholder="请选择学历"
						style="width: 300px;"
						class="g-m-r-10">
						<i-option
							v-for="item in education"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="邮箱：" prop="email">
					<i-input
						v-model="infoForm.email"
						:maxlength="50"
						clearable
						placeholder="请输入邮箱"/>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="微信号：" prop="wechat">
					<i-input
						v-model="infoForm.wechat"
						:maxlength="20"
						clearable
						placeholder="请输入微信号"/>
				</i-form-item>
			</div>
			<div class="_label-item g-flex">
				<i-form-item label="是否干部：" prop="is_leader">
					<i-radio-group v-model="infoForm.is_leader" class="g-flex g-jc-sa">
						<div class="g-flex">
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
			</div>
			<div v-if="infoForm.is_leader==1" class="_label-item g-flex" >
				<i-form-item label="干部职位：" prop="leader_position">
					<i-input
						v-model="infoForm.leader_position"
						:maxlength="15"
						clearable
						placeholder="请输入干部职位"/>
				</i-form-item>
			</div>
			<div class="_label-item g-flex">
				<i-form-item label="招聘会学校：" prop="college_id">
					<i-select
						v-model="infoForm.college_id"
						:remote-method="loadMeeting"
						:loading="meetingLoading"
						style="width: 300px;"
						filterable
						remote
						clearable
						transfer
						placeholder="请输入招聘会学校"
						@on-change="getMeetingTime"
					>
						<i-option
							v-for="(item, index) in meetingData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="招聘会时间：" prop="meeting_id">
					<i-select
						v-model="infoForm.meeting_id"
						clearable
						transfer
						placeholder="请选择招聘会时间"
						style="width: 300px">
						<i-option
							v-for="item in timeList"
							:key="item.meeting_id"
							:value="item.meeting_id">
							{{ item.meeting_time }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="招聘会年份：" prop="meeting_year">
					<i-select
						v-model="infoForm.meeting_year"
						clearable
						transfer
						placeholder="请选择招聘会年份"
						style="width: 300px">
						<i-option
							v-for="item in meetingYear"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="招聘会季节：" prop="season_type">
					<i-select
						v-model="infoForm.season_type"
						clearable
						transfer
						placeholder="请选择招聘会季节"
						style="width: 300px">
						<i-option
							v-for="item in seasonType"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>

			<!-- 以下需要根据状态来判断是否显示 -->
			<div
				v-if="[2,3,4,5,6,7,8,9,10].indexOf(data.status) > -1"
				class="_label-item g-flex">
				<i-form-item label="面试结果：" prop="interview_result">
					<i-select
						v-model="infoForm.interview_result"
						clearable
						transfer
						placeholder="请选择面试结果"
						style="width: 300px;"
						class="g-m-r-10">
						<i-option
							v-for="item in interResultList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>

			<!-- <div
				v-if="[2,3,4,5,6,7,9,10].indexOf(data.status) > -1"
				class="_label-item g-flex">
				<i-form-item label="发offer时间：">
					<i-date-picker
						v-model="infoForm.send_offer_time"
						type="date"
						clearable
						transfer
						placeholder="请选择发offer时间"
						style="width: 300px"/>
				</i-form-item>
			</div> -->

			<div
				v-if="[3,4,5,6,7,9,10].indexOf(data.status) > -1"
				class="_label-item g-flex">
				<i-form-item label="回复报到时间：" prop="reply_time">
					<i-date-picker
						v-model="infoForm.reply_time"
						type="date"
						clearable
						transfer
						placeholder="请选择回复报到时间"
						style="width: 300px"/>
				</i-form-item>
			</div>

			<div
				v-if="[3,4,5,6,7,9,10].indexOf(data.status) > -1"
				class="_label-item g-flex">
				<i-form-item label="车票信息：">
					<i-input
						v-model="infoForm.ticket_info"
						:maxlength="50"
						clearable
						placeholder="请输入车票信息"
						class="g-m-b-20"/>

					<i-date-picker
						v-model="infoForm.ticket_time"
						:disabled="infoForm.ticket_info ? false : true"
						type="datetimerange"
						clearable
						transfer
						split-panels
						format="yyyy-MM-dd HH:mm:ss"
						placeholder="请选择开车时间-到站时间"
						style="width: 300px"/>
				</i-form-item>
			</div>

			<div
				v-if="[3,4,5,6,7,9,10].indexOf(data.status) > -1"
				class="_label-item g-flex">
				<i-form-item label="试岗部门：" prop="try_depart_id">
					<i-cascader
						:data="departAll"
						v-model="infoForm.try_depart_id"
						:change-on-select="true"
						clearable
						transfer
						placeholder="请选择试岗部门"
						trigger="hover"
						style="width: 300px;"
						class="g-m-r-10" />
				</i-form-item>
			</div>

			<div
				v-if="[3,4,5,6,7,10].indexOf(data.status) > -1"
				class="_label-item g-flex">
				<i-form-item label="实际报到时间：" prop="register_time">
					<i-date-picker
						v-model="infoForm.register_time"
						type="date"
						clearable
						transfer
						placeholder="请选择实际报到时间"
						style="width: 300px"/>
				</i-form-item>
			</div>

			<div
				v-if="[4].indexOf(data.status) > -1"
				class="_label-item g-flex">
				<i-form-item label="预计入职时间：" prop="predict_entry_time">
					<i-date-picker
						v-model="infoForm.predict_entry_time"
						type="date"
						clearable
						transfer
						placeholder="请选择预计入职时间"
						style="width: 300px"/>
				</i-form-item>
			</div>

			<div
				v-if="[3,4,5,6].indexOf(data.status) > -1"
				class="_label-item g-flex">
				<i-form-item label="试岗时间：" prop="try_start_time">
					<i-date-picker
						v-model="infoForm.try_start_time"
						type="daterange"
						clearable
						transfer
						split-panels
						placeholder="请选择试岗时间"
						style="width: 300px"/>
				</i-form-item>
			</div>

			<div v-if="data.status === 11" class="_label-item g-flex">
				<i-form-item label="离开时间：" prop="departure_time">
					<i-date-picker
						v-model="infoForm.departure_time"
						clearable
						transfer
						placeholder="请选择离开时间"
						style="width: 300px"/>
				</i-form-item>
			</div>

			<div v-if="data.status === 11" class="_label-item g-flex">
				<i-form-item label="离开原因：" prop="departure_reason">
					<oa-limit-words
						:value="infoForm.departure_reason"
						:max="200"
						placeholder="请输入离开原因"
						style="width: 300px"/>
				</i-form-item>
			</div>

			<div v-if="data.status === 6" class="_label-item g-flex">
				<i-form-item label="淘汰类型：" prop="pass_type">
					<i-select
						v-model="infoForm.pass_type"
						clearable
						transfer
						placeholder="请选择淘汰类型"
						style="width: 300px">
						<i-option
							v-for="item in passList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>

			<div v-if="data.status === 6" class="_label-item g-flex">
				<i-form-item label="淘汰原因：" prop="pass_remarks">
					<oa-limit-words
						:value="infoForm.pass_remarks"
						:max="500"
						placeholder="请输入淘汰原因"
						style="width: 300px"/>
				</i-form-item>
			</div>

			<div class="_label-item g-flex">
				<i-form-item label="简历附件：" prop="resume">
					<oa-upload
						v-model="infoForm.resume"
						:max="10"
						style="width: 300px"
					/>
				</i-form-item>
			</div>
		</i-form>
	</div>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import { dataValidity, initTreeData } from '@utils/utils';
import Upload from '@components/_common/upload/upload';
import { services, interResultList, passList, searchMeeting, createSearch } from '@stores/services/hr';
import { Button, Cascader, Form, FormItem, DatePicker,
	Input, Select, Option, Radio, RadioGroup } from 'iview';

export default {
	name: "oa-tpl",
	components: {
		'i-button': Button,
		"i-date-picker": DatePicker,
		'i-cascader': Cascader,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-radio": Radio,
		"i-radio-group": RadioGroup,
		"oa-upload": Upload
	},
	mixins: [
		services.departAll(),
		services.recruitDePosition(),
		services.education(),
		services.meetingYear(),
		services.seasonType(),
		createSearch({ key: 'interviewer' }),
		searchMeeting,
		interResultList,
		passList
	],
	props: {
		data: {
			type: Object
		}
	},
	data() {
		let validateDate = (rule, value, callback) => {
			if (!value[0] || !value[1]) {
				callback(new Error("请选择试岗时间"));
			} else { callback(); }
		};
		return {
			timeList: [],
			infoForm: {},
			infoRule: {
				applicant_name: [
					{ required: true, message: "请输入姓名", trigger: "blur" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				mobile: [
					{ required: true, message: "请输入手机号码", trigger: "blur" },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: "blur" }
				],
				sex: [{ required: true, message: "请选择性别", pattern: /.+/, trigger: "change" }],
				is_leader: [{ required: true, message: "请选择是否为干部", pattern: /.+/, trigger: "change" }],
				position_id: [{ required: true, message: "请选择应聘职位", trigger: "change", type: 'array' }],
				college: [
					{ required: true, message: "请输入毕业学校", trigger: "blur" },
					{ type: 'validName', validator: dataValidity, trigger: "blur" }
				],
				college_id: [{ required: true, message: "请选择招聘会学校", pattern: /.+/, trigger: "change" }],
				meeting_id: [{ required: true, message: "请选择招聘会时间", pattern: /.+/, trigger: "change" }],
				meeting_year: [{ required: true, message: "请选择招聘会年份", pattern: /.+/, trigger: "change" }],
				season_type: [{ required: true, message: "请选择招聘会季节", pattern: /.+/, trigger: "change" }],
				profession: [
					{ required: true, message: "请输入专业", trigger: "blur" },
					{ type: 'validName', validator: dataValidity, trigger: "blur" }
				],
				education: [{ required: true, message: "请选择学历", pattern: /.+/, trigger: "change" }],
				email: [
					{ type: 'validEmail', validator: dataValidity, trigger: "blur" }
				],
				leader_position: [
					{ required: true, message: "请输入干部职位", trigger: "blur" },
					{ type: 'validCompellation', message: '请输入正确的干部职位', validator: dataValidity, trigger: "blur" }
				],
				ticket_info: [{ validator: dataValidity, type: 'validTrainNum', trigger: 'blur' }],
				wechat: [
					// { validator: dataValidity, type: 'validWeChat', trigger: "blur" }
				],
				interview_result: [{ required: true, message: "请选择面试结果", pattern: /.+/, trigger: "change" }],
				// send_offer_time: [{ required: true, message: "请选择发offer时间", type: 'object', trigger: "change" }],
				reply_time: [{ required: true, message: "请选择回复报到时间", type: 'object', trigger: "change" }],
				// try_depart_id: [{ required: true, message: "请选择试岗部门", type: 'array', trigger: "change" }],
				register_time: [{ required: true, message: "请选择实际报到时间", type: 'object', trigger: "change" }],
				predict_entry_time: [{ required: true, message: "请选择预计入职时间", type: 'object', trigger: "change" }],
				try_start_time: [
					{ required: true, message: "请选择试岗时间", type: 'array', trigger: "change" },
					{ validator: validateDate, trigger: 'change' }
				],
				departure_time: [{ required: true, message: "请选择离开时间", type: 'object', trigger: "change" }],
				departure_reason: [{ required: true, message: "请输入离开理由", trigger: "blur" }],
				pass_type: [{ required: true, message: "请选择淘汰类型", pattern: /.+/, trigger: "change" }],
				pass_remarks: [{ required: true, message: "请输入淘汰理由", trigger: "blur" }],
			}
		};
	},
	mounted() {
		this.interviewer = this.data.interviewer_name || '';
		this.infoForm = {
			...this.data,
			position_id: [this.data.depart_id, this.data.position_id],
			alternative_position_id: [this.data.alternative_depart_id, this.data.alternative_position_id],
			try_depart_id: this.data.try_depart_array,
			ticket_info: this.data.ticket_info,
			ticket_time: [this.data.ticket_departure_time, this.data.ticket_arrive_time],
			resume: this.formatResume(this.data.resume),
			meeting_year: this.data.meeting_year == 0 ? '' : +this.data.meeting_year,
			season_type: this.data.season_type == 0 ? '' : +this.data.season_type,
			try_start_time: [this.data.try_start_time, this.data.try_end_time]
		};

		// 搜索招聘会请求
		this.$request({
			url: API_ROOT._HR_RECRUIT_SCHOOL_SUMMARY_SEARCH_MEETING_POST,
			type: 'GET',
			param: {
				search: this.infoForm.school.trim()
			},
			loading: false
		}).then(res => {
			let obj = res.data.filter(item => item.college_id === this.infoForm.college_id);
			this.meetingData = initTreeData(res.data, 'college_id', 'college');
			// 获取招聘会时间下拉框
			this.timeList = obj[0].children;
		}).catch(err => {});
	},
	methods: {
		handleQueryChange(query = '') {
			let targetQuery = this.infoForm['interviewer_name'] || '';
			if (targetQuery.length > query.length) {
				this.$refs.interviewer.clearSingleSelect();
			}
		},
		handleChange(value) {
			this.infoForm.interviewer_id = value && String(value.value) ? value.value : '';
			this.infoForm.interviewer_name = value && value.label ? value.label : '';
		},
		// 获取招聘会时间下拉框
		getMeetingTime(val) {
			this.meetingData.forEach(item => {
				if (item.value === val) {
					item.children instanceof Array ? this.timeList = item.children
						: this.timeList[0] = { ...item.children };
				}
			});
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
	}
};
</script>

<style lang="scss">
.v-hr-recruit-detail-edit {
    ._label-item {
		width: 400px;
		.ivu-input-wrapper {
			width: 300px;
		}
	}
	.ivu-form .ivu-form-item-label {
		color: #4b4f57;
	}
}
</style>
