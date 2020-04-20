<template>
	<div class="v-hr-recruit-school-jobfair-edit">
		<div class="_wrapper g-flex-cc g-jc-c">
			<div class="__title g-fs-16 g-m-b-20 g-m-l-20">{{ formValidate.school_name }}</div>
			<i-form
				ref="form"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="115"
				class="__form g-flex g-jc-sb g-fw-w"
				position="left"
			>
				<i-form-item label="性质:" prop="school_type">
					<i-select
						v-model="formValidate.school_type"
						style="width: 300px"
						clearable
						transfer
						placeholder="请选择学校性质"
					>
						<i-option
							v-for="(item, index) in schoolTypeList"
							:key="index"
							:value="item.id"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="官网：" prop="school_url">
					<i-input
						v-model="formValidate.school_url"
						:maxlength="45"
						style="width: 300px"
						placeholder="请输入招聘会学校官网"
					/>
				</i-form-item>
				<i-form-item label="官网账号：">
					<i-input
						v-model="formValidate.college_amount_number"
						:maxlength="20"
						style="width: 300px"
						placeholder="请输入招聘会学校官网账号"
					/>
				</i-form-item>
				<i-form-item label="官网密码：">
					<i-input
						v-model="formValidate.college_password"
						:maxlength="20"
						style="width: 300px"
						placeholder="请输入招聘会学校官网密码"
					/>
				</i-form-item>
				<i-form-item label="招聘会类型:" prop="action_type">
					<i-select
						v-model="formValidate.action_type"
						style="width: 300px"
						clearable
						transfer
						placeholder="请选择招聘会类型"
					>
						<i-option
							v-for="(item, index) in activityTypeList"
							:key="index"
							:value="item.id"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="招聘会时间:" prop="action_time">
					<i-date-picker
						v-model="formValidate.action_time"
						type="datetimerange"
						style="width: 300px"
						split-panels
						placeholder="请选择招聘时间"
					/>
				</i-form-item>
				<i-form-item label="参与人:">
					<i-select
						v-model="formValidate.person"
						style="width: 300px"
						clearable
						transfer
						filterable
						multiple
						placeholder="请选择负责人"
					>
						<i-option
							v-for="(item, index) in personList"
							:key="index"
							:value="item.staff_id"
						>
							{{ item.staff_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="联系老师:" prop="teacher">
					<i-input
						v-model="formValidate.teacher"
						:maxlength="50"
						style="width: 300px"
						placeholder="请输入联系老师"
					/>
				</i-form-item>
				<i-form-item label="联系电话1" prop="telephone1">
					<i-input
						v-model="formValidate.telephone1"
						:maxlength="13"
						style="width: 300px"
						placeholder="请输入联系电话1"
					/>
					<i
						v-if="addShow"
						class="g-pointer g-c-blue-mid icon iconfont icon-add1"
						style="position: absolute;right: -20px;top: 3px;"
						@click="handleAdd"
					/>
				</i-form-item>
				<i-form-item v-if="!addShow" label="联系电话2" prop="telephone2">
					<i-input
						v-model="formValidate.telephone2"
						:maxlength="13"
						style="width: 300px"
						placeholder="请输入联系电话2"
					/>
					<i
						v-if="!addShow"
						class="g-pointer g-c-red-mid icon iconfont icon-remove-circle"
						style="position: absolute;right: -20px;top: 3px;"
						@click="handleRemove"
					/>
				</i-form-item>
				<i-form-item label="发资料微信:">
					<i-input
						v-model="formValidate.condition"
						:maxlength="45"
						style="width: 300px"
						placeholder="请输入发资料微信"
					/>
				</i-form-item>
				<i-form-item label="发资料邮箱:" prop="email">
					<i-input
						v-model="formValidate.email"
						:maxlength="45"
						style="width: 300px"
						placeholder="请输入发资料邮箱"
					/>
				</i-form-item>
				<i-form-item label="学校地址:" prop="region">
					<i-cascader
						v-model="formValidate.region.region"
						:data="region"
						style="width: 175px; display: inline-block"
						clearable
						transfer
						trigger="hover"
						placeholder="请选择地址"
					/>
					<i-input
						v-model="formValidate.region.detail"
						:maxlength="100"
						style="width: 121px"
						placeholder="请输入详细地址"
					/>
				</i-form-item>
				<i-form-item label="参与情况:">
					<i-select
						v-model="formValidate.status"
						style="width: 300px"
						clearable
						transfer
						placeholder="请选择参与情况"
					>
						<i-option
							v-for="(item, index) in statusList"
							:key="index"
							:value="item.id"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="电话沟通进度:">
					<oa-limit-words
						v-model="formValidate.station"
						:max="500"
						style="width: 300px"
						placeholder="请输入电话沟通进度"
					/>
				</i-form-item>
				<i-form-item label="备注:">
					<!-- <div style="position: relative;"> -->
					<oa-limit-words
						v-model="formValidate.remarks"
						:max="500"
						style="width: 300px"
						placeholder="请输入备注"
					/>
					<!-- </div> -->
				</i-form-item>
			</i-form>
			<!-- footer -->
			<div class="_footer g-flex-cc">
				<div
					class="g-gray-btn-small g-m-r-10"
					@click="$router.back()"
				>
					取消
				</div>
				<vc-debounce-click
					class="g-red-btn-small"
					@click="handleSave"
				>
					保存
				</vc-debounce-click >
			</div>
		</div>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio,
	Select, Option, DatePicker, Cascader, Message
} from 'iview';
import Upload from '@components/_common/upload/upload';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';
// utils
import { services, inviteType, workTime } from '@stores/services/hr';
import { services as commonServices } from '@stores/services/common';
import { dataValidity, objRegex } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'oa-content',
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
		'oa-upload': Upload,
		'oa-limit-words': LimitWords
	},
	mixins: [
		commonServices.region(),
		workTime
	],
	data() {
		const validatePhone = (rule, value, callback) => {
			let isPhone = /^(13[0-9]|14[5|7]|15[^4|^\D]|17[0-9]|19[1|8|9]|166|18[0-9])\d{8}$/;
			let isMob = /^0[1-9][0-9]{1,2}[-]?[2-8][0-9]{6,7}$/;
			let isTel = /^[4|8]00[-]?[0-9]{6,7}$/;
			if (!value) {
				return callback(new Error('电话号不能为空'));
			} else if (isPhone.test(value) || isMob.test(value) || isTel.test(value)) {
				callback();
			} else {
				callback('电话号格式不正确');
			}   
		};
		const validateEmail = (rule, value, callback) => {
			let isEmail = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
			if (isEmail.test(value) || !value) {
				callback();
			} else {
				callback('请输入正确的邮箱格式');
			}   
		};
		return {
			index: 1,
			addShow: true,
			formValidate: {
				age: null,
				person: [],
				region: {
					region: [],
					detail: ''
				},
				position: [],
				station: '',
				remarks: '',
				telephone1: '',
				telephone2: '',
				teacher: '',
				school_type: '',
				school_url: '',
				college_amount_number: '',
				college_password: '',
				action_type: '',
				action_time: [],
				condition: '',
				email: '',
				status: '',
			},
			ruleValidate: {
				school_name: [
					{ required: true, message: '请输入招聘会学校名称', trigger: 'blur' },
					{ type: 'validName', validator: dataValidity, trigger: "blur" }
				],
				school_type: [
					{ required: true, type: 'number', message: '请选择学校性质', trigger: 'change' }
				],
				school_url: [
					{ required: true, message: '请输入学校官网', trigger: 'blur' }
				],
				action_type: [
					{ required: true, type: 'number', message: '请选择招聘会类型', trigger: 'change' }
				],
				action_time: [{
					type: 'array',
					required: true,
					fields: {
						0: { type: 'date', required: true, message: '请输入招聘会时间起止日期' },
						1: { type: 'date', required: true, message: '请输入招聘会时间起止日期' }
					}
				}],
				person: [
					{ required: true, type: 'array', message: '请选择参与人' }
				],
				teacher: [
					{ required: true, message: '请输入联系老师', trigger: 'blur' }
				],
				telephone1: [
					{ required: true, message: "联系电话1不能为空", trigger: "blur" },
					{ validator: validatePhone, trigger: "blur" }
				],
				telephone2: [
					{ required: true, message: "联系电话2不能为空", trigger: "blur" },
					{ validator: validatePhone, trigger: "blur" }
				],
				region: [
					{
						type: 'object',
						required: true,
						trigger: 'blur',
						fields: {
							region: [{ required: true, type: 'array', message: '请选择地区', trigger: 'change' }],
							detail: [{ required: true, message: '请填写详细地区', trigger: 'blur' }],
						}
					}
				],
				email: [{ type: 'email', message: '请输入正确格式邮箱', trigger: 'blur' },
					{ message: "请输入正确格式邮箱", validator: validateEmail, trigger: "blur" }],
				remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }]
			},
			schoolTypeList: [
				{
					id: 0,
					label: '公办专科学校'
				},
				{
					id: 1,
					label: '公办本科学校'
				},
				{
					id: 2,
					label: '私办专科学校'
				},
				{
					id: 3,
					label: '私办本科学校'
				}
			],
			activityTypeList: [
				{
					id: 0,
					label: '大型招聘会'
				},
				{
					id: 1,
					label: '专场招聘会'
				}
			],
			statusList: [
				{
					id: 0,
					label: '审核中'
				},
				{
					id: 1,
					label: '待参加'
				},
				{
					id: 2,
					label: '已参加'
				},
				{
					id: 3,
					label: '未参加'
				}
			],
			personList: []
		};
	},
	created() {
		this.getPersonList();
		this.getInfoData();
	},
	updated() {
		// this.$forceUpdate();
	},
	methods: {
		getPersonList() {
			this.$request({
				url: API_ROOT['HR_RECRUIT_SOCIAL_SUMMARY_ALLOCATE_LIST_GET'],
				type: 'GET',
				param: {},
				loading: false
			}).then((res) => {
				this.personList = res.data;
			}).catch((err) => {
				this.loading = false;
			});
		},
		handleAdd() {
			this.addShow = false;
		},
		handleRemove() {
			this.addShow = true;
			this.formValidate.telephone2 = '';
		},
		getInfoData() {
			this.$request({
				url: API_ROOT['_HR_RECRUIT_SCHOOL_JOBFAIR_INFO_GET'], // eslint-disable-line
				type: "GET",
				param: {
					meeting_id: this.$route.query.id
				}
			}).then((res) => {
				let staff = [];
				res.data.list[0].join_staff.map(item => {
					staff.push(item.staff_id);
					return;
				});
				let regionArr = [];
				res.data.list[0].province ? regionArr = [res.data.list[0].province, res.data.list[0].city] : '';
				this.formValidate.school_name = res.data.list[0].school;
				this.formValidate.school_type = res.data.list[0].college_type;
				this.formValidate.school_url = res.data.list[0].college_url;
				this.formValidate.action_type = res.data.list[0].meeting_type;

				this.formValidate.action_time = res.data.list[0].meeting_time;

				this.formValidate.person = staff;

				this.formValidate.teacher = res.data.list[0].contact_teacher;
				this.formValidate.telephone1 = res.data.list[0].contact_tel[0];
				if (res.data.list[0].contact_tel[1]) {
					this.addShow = false;
					this.formValidate.telephone2 = res.data.list[0].contact_tel[1];
				}
				this.formValidate.station = res.data.list[0].communication_progress;
				this.formValidate.condition = res.data.list[0].email_wechat;
				this.formValidate.region.region = regionArr;
				this.formValidate.region.detail = res.data.list[0].address;
				this.formValidate.status = res.data.list[0].status;
				this.formValidate.college_amount_number = res.data.list[0].college_amount_number;
				this.formValidate.college_password = res.data.list[0].college_password;
				this.formValidate.remarks = res.data.list[0].remarks;
				this.formValidate.email = res.data.list[0].email;
			}).catch((error) => {
				Message.error(error.msg);
			});
		},
		handleSave() {
			this.$refs.form.validate((valid) => {
				let obj = {};
				let teacherArr = [];
				let timeArr = [];
				let time1 = moment(this.formValidate.action_time[0]).format('YYYY-MM-DD HH:mm:ss');
				let time2 = moment(this.formValidate.action_time[1]).format('YYYY-MM-DD HH:mm:ss');
				timeArr.push(time1);
				timeArr.push(time2);
				teacherArr.push(this.formValidate.telephone1);
				if (this.formValidate.telephone2) {
					teacherArr.push(this.formValidate.telephone2);
				}
				obj.meeting_id = this.$route.query.id;
				obj.school = this.formValidate.school_name;
				obj.college_type = this.formValidate.school_type;
				obj.college_url = this.formValidate.school_url;
				obj.meeting_type = this.formValidate.action_type;
				obj.meeting_time = timeArr;
				obj.contact_teacher = this.formValidate.teacher;
				obj.contact_tel = teacherArr;
				obj.province = this.formValidate.region.region[0];
				obj.city = this.formValidate.region.region[1];
				obj.address = this.formValidate.region.detail;
				obj.staff_id = this.formValidate.person;
				obj.communication_progress = this.formValidate.station;
				obj.email_wechat = this.formValidate.condition;
				obj.status = this.formValidate.status;

				obj.college_amount_number = this.formValidate.college_amount_number;
				obj.college_password = this.formValidate.college_password;
				obj.remarks = this.formValidate.remarks;
				obj.email = this.formValidate.email;
				if (valid) {
					try {
						this.$request({
							url: API_ROOT['_HR_RECRUIT_SCHOOL_JOBFAIR_ADD_POST'], // eslint-disable-line
							type: "POST",
							param: obj
						}).then((res) => {
							this.$router.back();
						}).catch((error) => {
							this.$Message.error(error.msg);
						});
					} catch (error) {
						console.error(error);
					}
				}
			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-recruit-school-jobfair-edit {
	.ivu-select-multiple .ivu-select-selection {
		max-height: 100px;
		overflow-y: auto;
	}
	._wrapper {
		flex-direction: column;
		padding: 20px 0 60px 0;
		.__title {
			min-width: 400px;
			max-width: 900px;
			width: 100%;
			color: #000;
		}
		.__form {
			min-width: 400px;
			max-width: 900px;
			margin-bottom: 50px;
			.ivu-radio-wrapper:first-child {
				margin-right: 50px;
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
	}
}
</style>
