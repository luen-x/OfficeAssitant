<template>
	<div class="v-hr-recruit-school-summary-add g-flex g-jc-c">
		<div>
			<i-form
				ref="infoForm"
				:model="infoForm"
				:rules="infoRule"
				:label-width="110"
				class="_form g-flex-ac g-jc-sb g-fw-w">
				<i-form-item :show-message="false" label="手机号码:" prop="mobile" class="_cus-error-tip" >
					<i-input
						v-model="infoForm.mobile"
						:maxlength="11"
						clearable
						style="width: 300px"
						placeholder="请输入手机号码"
					/>
					<transition name="fade">
						<div class="ivu-form-item-error-tip" style="margin-bottom:0">
							<span >{{ tip }}</span>
							<span v-if="type==2||type==3||type==5||type==8" class="g-operation" @click="handleRecover">
								点击恢复
							</span>
						</div>
					</transition>
				</i-form-item>

				<i-form-item label="姓名：" prop="applicant_name">
					<i-input
						v-model="infoForm.applicant_name"
						:maxlength="10"
						clearable
						placeholder="请输入姓名"/>
				</i-form-item>

				

				<i-form-item label="性别：" prop="sex">
					<i-radio-group v-model="infoForm.sex" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 300px;">
							<div>
								<i-radio :label="0">男</i-radio>
							</div>
							<div>
								<i-radio :label="1">女</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>

				<i-form-item label="应聘职位：" prop="position_id">
					<i-cascader
						v-model="infoForm.position_id"
						:data="recruitDePosition"
						clearable
						transfer
						filterable	
						trigger="hover"
						style="width: 300px;"
						placeholder="请选择应聘职位"
					/>
				</i-form-item>

				<i-form-item label="备选职位：" prop="alternative_position_id">
					<i-cascader
						v-model="infoForm.alternative_position_id"
						:data="recruitDePosition"
						clearable
						filterable	
						transfer
						trigger="hover"
						style="width: 300px;"
						placeholder="请选择应聘职位"
					/>
				</i-form-item>

				<i-form-item label="毕业学校：" prop="college">
					<i-input
						:maxlength="55"
						v-model="infoForm.college"
						clearable
						placeholder="请输入毕业学校"/>
				</i-form-item>

				<i-form-item label="专业：" prop="profession">
					<i-input
						:maxlength="20"
						v-model="infoForm.profession"
						clearable
						placeholder="请输入专业"/>
				</i-form-item>

				<i-form-item label="学历：" prop="education">
					<i-select
						v-model="infoForm.education"
						clearable
						transfer
						placeholder="请选择学历"
						style="width: 300px;">
						<i-option
							v-for="item in education"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="是否干部：" prop="is_leader">
					<i-radio-group v-model="infoForm.is_leader" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 300px;">
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>

				<i-form-item v-if="infoForm.is_leader==1" label="干部职位：" prop="leader_position">
					<i-input
						v-model="infoForm.leader_position"
						:maxlength="15"
						clearable
						placeholder="请输入干部职位"/>
				</i-form-item>
				<i-form-item label="邮箱：" prop="email">
					<i-input
						:maxlength="50"
						v-model="infoForm.email"
						clearable
						placeholder="请输入邮箱"/>
				</i-form-item>

				<i-form-item label="微信号：" prop="wechat">
					<i-input
						:maxlength="20"
						v-model="infoForm.wechat"
						clearable
						placeholder="请输入微信号"/>
				</i-form-item>

				<i-form-item label="招聘会学校：" prop="meeting_name">
					<i-select
						v-model="infoForm.meeting_name"
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

				<i-form-item label="招聘会时间：" prop="meeting_id">
					<i-select
						v-model="infoForm.meeting_id"
						clearable
						transfer
						placeholder="请选择招聘会时间"
						style="width: 300px;">
						<i-option
							v-for="item in timeList"
							:key="item.meeting_id"
							:value="item.meeting_id">
							{{ item.meeting_time }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="招聘会年份：" prop="meeting_year">
					<i-select
						v-model="infoForm.meeting_year"
						clearable
						transfer
						placeholder="请选择招聘会年份"
						style="width: 300px;">
						<i-option
							v-for="item in meetingYear"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="招聘会季节：" prop="season_type">
					<i-select
						v-model="infoForm.season_type"
						clearable
						transfer
						placeholder="请选择招聘会季节"
						style="width: 300px;">
						<i-option
							v-for="item in seasonType"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>

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
				<i-form-item label="面试时间：" prop="interview_time">
					<i-date-picker
						v-model="infoForm.interview_time"
						type="datetime"
						format="yyyy-MM-dd HH:mm"
						transfer
						clearable
						placeholder="请选择面试时间"
						style="width: 300px; "
						@on-change="handleDateChange"/>
				</i-form-item>

				<i-form-item label="简历附件：">
					<oa-upload
						v-model="infoForm.resume"
						:max="10"
						style="width: 300px"
					/>
				</i-form-item>

			</i-form>

		</div>

		<div class="_footer g-flex-cc">
			<vc-debounce-click
				class="g-gray-btn-line g-m-r-10"
				@click="handleCancel">
				取消
			</vc-debounce-click>
			<vc-debounce-click
				class="g-red-btn-small"
				@click="handleConfirm">
				确定
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { dataValidity, objRegex } from '@utils/utils';
import { DebounceClick } from "wya-vc";
import Upload from '@components/_common/upload/upload';
import { services, searchMeeting, createSearch } from '@stores/services/hr';
import { Button, Cascader, Form, FormItem, DatePicker, Input, Select, Option, Radio, RadioGroup } from 'iview';
import { debounce } from 'lodash';
import { PModal } from './popup/modal';

export default {
	name: 'oa-tpl',
	components: {
		'i-button': Button,
		'i-cascader': Cascader,
		"i-date-picker": DatePicker,
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
		services.recruitDePosition(),
		services.education(),
		services.meetingYear(),
		services.seasonType(),
		searchMeeting,
		createSearch({ key: 'interviewer' })
	],
	data() {

		return {
			timeList: [],
			tip: '',
			type: 0,
			spin: true,
			add_type: '',
			applicant_id: '',
			infoForm: {
				alternative_position_id: [],
				interviewer: []
			},
			infoRule: {
				applicant_name: [
					{ required: true, message: "请输入姓名", trigger: "blur" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				mobile: [
					{ required: true, validator: this.mobileValidator, trigger: 'change' }
				],
				sex: [{ required: true, message: "请选择性别", pattern: /.+/, trigger: "change" }],
				position_id: [{ required: true, message: "请选择应聘职位", type: 'array', trigger: "change" }],
				college: [
					{ required: true, message: "请输入毕业学校", trigger: "blur" },
					{ type: 'validName', validator: dataValidity, trigger: "blur" }
				],
				meeting_name: [{ required: true, message: "请选择招聘会学校", pattern: /.+/, trigger: "change" }],
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
				wechat: [
				// 	{
				// 	type: 'validWeChat', validator: dataValidity, message: '请输入正确的微信号', trigger: "blur"
				// }
				],
				is_leader: [{ required: true, message: "请选择是否为干部", pattern: /.+/, trigger: "change" }],
				leader_position: [
					{ required: true, message: "请输入干部职位", trigger: "blur" },
					{ type: 'validCompellation', message: '请输入正确的干部职位', validator: dataValidity, trigger: "blur" }
				],
			}
		};
	},
	created() {
		this.interviewer = '';
	},
	methods: {
		mobileValidator: debounce(function (rule, val, callback) {
			if (!objRegex.validMobile.regex.test(val)) {
				this.applicant_id = ''; 
				this.type = 0;
				this.add_type = '';
				this.tip = '请输入正确的手机号码';
				return callback(new Error('请输入正确的手机号码'));
			}
			this.$request({
				url: API_ROOT['_HR_RECRUIT_SUMMARY_ADD_CHECK_MOBILE_GET'], 
				type: "GET",
				loading: false,
				param: {
					mobile: this.infoForm.mobile,
				}
			}).then((res) => {
				this.type = res.data.type;
				this.applicant_id = res.data.applicant_id;
				this.add_type = res.data.add_type;
				if (res.data.type == 0) {
					this.tip = '';
					callback();
				} else {
					this.tip = res.data.reminder;
					callback(new Error(res.data.reminder));
				}
			}).catch((res) => {
				this.$Message.error(error.msg);
			});
		}, 100),
		handleRecover() {
			if (this.spin) {
				this.spin = false;
				this.$request({
					url: API_ROOT['HR_RECRUIT_SCHOOL_SUMMARY_RECOVER_POST'], 
					type: "POST",
					param: {
						applicant_id: this.applicant_id,
					}
				}).then((res) => {
					this.$Message.success('恢复成功');
					this.spin = true;
					this.$router.push(`/hr/recruit/social/summary/${this.applicant_id}?type=0&list_type=social-index`);
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			}
			
		},
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
		// 时间改变
		handleDateChange(val) {
			this.infoForm.interview_time = val;
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
		handleConfirm() {
			this.$refs['infoForm'].validate((valid) => {
				if (valid) {
					this.$request({
						url: API_ROOT._HR_RECRUIT_SCHOOL_SUMMARY_ADD_INFO_POST,
						type: 'POST',
						param: {
							...this.infoForm,
							depart_id: this.infoForm.position_id[0],
							position_id: this.infoForm.position_id[1],
							alternative_depart_id: this.infoForm.alternative_position_id.length ? this.infoForm.alternative_position_id[0] : '',
							alternative_position_id: this.infoForm.alternative_position_id.length ? this.infoForm.alternative_position_id[1] : '',
						},
						loading: false
					}).then(res => {
						this.$Message.success('录入成功！');
						this.$refs['infoForm'].resetFields();
						this.infoForm.resume = [];
						this.$router.push('/hr/recruit/school/summary');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} else {
					this.$Message.warning('请按照提示完善表单信息！');
				}
			});
		},
		// 清空表单
		handleCancel() {
			if (this.infoForm.mobile) {
				PModal.popup({}).then(res => {
					this.$refs['infoForm'].resetFields();
					this.infoForm.resume = [];
					this.$router.push('/hr/recruit/school/summary');
				}).catch(err => {});
			} else {
				this.$refs['infoForm'].resetFields();
				this.infoForm.resume = [];
				this.$router.push('/hr/recruit/school/summary');
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.v-hr-recruit-school-summary-add {
	height: inherit;
	overflow: auto;
	padding-top: 20px;
	padding-bottom: 20px;
	._form {
		min-width: 410px;
		max-width: 900px;
		.ivu-input-wrapper {
			width: 300px;
		}
	}
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	._cus-error-tip {
		.ivu-form-item-error-tip {
			position: relative;
			margin-bottom: -20px;
			line-height: 18px;
			top: -2px;
		}
	}
}
</style>
