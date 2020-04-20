<template>
	<div class="v-hr-summary-resume">
		<div class="g-flex g-flex-cc g-flex-ac  g-m-t-30">
			<i-form
				ref="form"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="110"
				:style="'width: 900px'"
				class="_form"
				position="center"
			>
				<oa-form-info
					:form-validate="formValidate"
					:old="old"
					:rules="ruleValidate"
					@edit="handleEdit"
					@save="handleSave"
					@cancel="handleCancel"
				/>
				<oa-form-iden
					:form-validate="formValidate"
					:old="old"
					:rules="ruleValidate"
					@edit="handleEdit"
					@save="handleSave"
					@cancel="handleCancel"
				/>
				<oa-form-study
					:form-validate="formValidate"
					:old="old"
					:rules="ruleValidate"
					@edit="handleEdit"
					@save="handleSave"
					@cancel="handleCancel"
				/>
				<oa-form-other
					:form-validate="formValidate"
					:old="old"
					:rules="ruleValidate"
					@edit="handleEdit"
					@save="handleSave"
					@cancel="handleCancel"
				/>
				<oa-form-study-exper
					:form-validate="formValidate"
					:old="old"
					:rules="ruleValidate"
					@edit="handleEdit"
					@save="handleSave"
					@cancel="handleCancel"
				/>
				<oa-form-job-exper
					:form-validate="formValidate"
					:old="old"
					:rules="ruleValidate"
					@edit="handleEdit"
					@save="handleSave"
					@cancel="handleCancel"
				/>
			</i-form>
		</div>
		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print :info="info"/>
			</vc-print>
		</div>
		<footer v-if="isPrint" class="g-flex-cc">
			<div
				style="display: inline-block;"
				class="g-red-btn-small"
				@click="handlePrint"
			>
				打印
			</div>
		</footer>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	Form,
	Button
} from "iview";
// utils
import lodash from "lodash";
import moment from "moment";
import { dataValidity, getHashUrl } from "@utils/utils";
import { ImgsPicker, Print } from "wya-vc";
import { services } from "@stores/services/hr";
import LimitWords from '@components/_common/limit-words/limit-words';
import Title from "../_common/title";
import ResumePrint from "../employee-summary-resume/print";
import FormInfo from './form-info';
import FormIden from './form-iden';
import FormStudy from './form-study';
import FormOther from './form-other';
import FormStudyExper from './form-study-exper';
import FormJobExper from './form-job-exper';

export default {
	name: "v-hr-summary-resume",
	components: {
		"i-form": Form,
		"i-button": Button,
		"oa-title": Title,
		"oa-print": ResumePrint,
		'oa-limit-words': LimitWords,
		"vc-print": Print,
		'oa-form-info': FormInfo,
		'oa-form-iden': FormIden,
		'oa-form-study': FormStudy,
		'oa-form-other': FormOther,
		'oa-form-study-exper': FormStudyExper,
		'oa-form-job-exper': FormJobExper
	},
	data() {
		const { query = {} } = this.$route;
		return {
			info: {},
			isPrint: true,
			is_person: !!query.from,
			old: {},
			formValidate: {
				applicant_name: "",
				sex: "",
				height: "",
				hobby: "",
				blood: "",
				constellation: "",
				salary: "",
				mobile: "",
				wechat: "",
				position_id: [], // "商务经理"
				email: "",
				native: '',
				region: [],
				id_card: "",
				birthday: "",
				nation_id: [],
				is_married: "",
				birthday_type: "",
				address: "",
				now_address: "",
				college: "",
				graduate_time: "", // 毕业时间
				education: [], // 学历
				education_id: "",
				profession: "", // 专业
				important_name: "", // 紧急联系人姓名
				important_phone: "", // 紧急联系人电话
				// hobby: "", // 个人特长
				english_skills: "", // 外语能力
				computer_skills: "", // 计算机能力
				front_impression: "", // 对前台的印象
				edu_experience: [],
				job_experience: []
			},
			ruleValidate: {
				applicant_name: [
					{ required: true, message: "姓名为必填" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				sex: [
					{ required: true, message: "性别为必选", trigger: "change" }
				],
				position_id: [
					{
						required: true,
						type: "array",
						message: "应聘职位为必选",
						trigger: "change"
					}
				],
				region: [
					{
						required: true,
						type: "array",
						message: "籍贯为必选",
						trigger: "change",
						validator: this.validatorRegion
					}
				],
				height: [
					{ required: false },
					{
						type: "validNum",
						message: "请输入数字",
						validator: dataValidity
					}
				],
				salary: [
					{ required: true, message: "期望薪资为必填" }
				],
				mobile: [
					{ required: true, message: "手机号码为必填" },
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				wechat: [{ required: true, message: "微信号为必填" }],
				email: [
					{ required: true, message: "邮箱必填", trigger: "blur" },
					{ type: 'validEmail', validator: dataValidity, trigger: "blur" }
				],
				id_card: [
					{ required: true, message: "身份证为必填" },
					{
						required: true,
						message: "身份证位数不正确",
						min: 18
					},
					{
						type: "validId",
						message: "身份证格式不正确",
						validator: dataValidity
					}
				],
				birthday: [
					{
						required: true,
						pattern: /.+/,
						message: "公历生日为必选",
						trigger: "change"
					}
				],
				birthday_type: [
					{
						required: true,
						message: "生日类型为必选",
						trigger: "change"
					}
				],
				nation_id: [
					{
						required: true,
						message: "民族为必选",
						type: "number",
						trigger: "change"
					}
				],
				is_married: [
					{ required: true, message: "婚姻为必选", trigger: "change" }
				],
				address: [
					{
						required: true,
						message: "户口地址为必填",
						trigger: "blur"
					},
					{
						type: "string",
						max: 50,
						message: "最多50个字",
						trigger: "blur"
					}
				],
				now_address: [
					{
						required: true,
						message: "现住地址为必填",
						trigger: "blur"
					},
					{
						type: "string",
						max: 50,
						message: "最多50个字",
						trigger: "blur"
					}
				],
				college: [{ required: true, message: "毕业院校为必填" }],
				education: [
					{
						required: true,
						message: "学历为必选",
						type: "number",
						trigger: "change"
					}
				],
				graduate_time: [
					{
						required: true,
						pattern: /.+/,
						message: "毕业时间为必选",
						trigger: "change"
					}
				],
				profession: [{ required: true, message: "专业为必填" }],
				important_name: [
					{ required: true, message: "紧急联系人为必填" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				important_phone: [
					{ required: true, message: "紧急联系人电话为必填" },
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				hobby: [{ required: true, message: "爱好特长为必填" }],
				english_skills: [
					{
						required: true,
						type: "number",
						message: "外语能力为必选",
						trigger: "change"
					}
				],
				computer_skills: [
					{
						required: true,
						type: "number",
						message: "计算机能力为必选",
						trigger: "change"
					}
				],
				front_impression: [
					{
						required: true,
						type: "number",
						message: "对前台印象为必选",
						trigger: "change"
					}
				],
				edu_school: [
					{ required: true, message: "学校或培训信息为必填" }
				],
				edu_course: [{ required: true, message: "专业或课程为必填" }],
				edu_certificate: [
					{ required: true, message: "获得证书为必填" }
				],
				edu_time: [
					{
						required: true,
						type: "array",
						trigger: "change",
						message: "教育时间为必选",
						validator: this.validatorTime
					}
				],
				job_company_name: [
					{ required: true, message: "公司名称为必填" }
				],
				job_position: [{ required: true, message: "职位信息为必填" }],
				job_salary: [
					{ required: false, message: "月收入为必填" }
				],
				job_time: [
					{
						required: true,
						type: "array",
						trigger: "change",
						message: "工作时间为必选",
						validator: this.validatorTime
					}
				],
				job_superior: [
					{ required: true, message: "直接上司为必填" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				job_superior_phone: [
					{
						required: true,
						message: "上司联系方式为必填",
						trigger: "blur"
					},
					{
						type: "validContact",
						message: "联系格式不正确",
						validator: dataValidity
					}
				],
				job_superior_position: [
					{ required: false, message: "直接上司职位为必填" }
				],
				health_condition: [
					{
						required: true,
						message: "健康状况为必填",
						trigger: "blur"
					}
				],
				has_medical_history: [
					{
						required: true,
						message: "重大病史为必选",
						trigger: "change"
					}
				],
				medical_history: [
					{
						required: true,
						message: "病史说明为必填",
						trigger: "blur"
					}
				],
				social_suspension_date: [
					{
						required: true,
						pattern: /.+/,
						message: "社保停缴时间为必选",
						trigger: "change"
					}
				],
				last_social_company: [
					{
						required: true,
						message: "上家社保缴纳公司名称为必填",
						trigger: "change"
					}
				],
				ali_sesame_credit: [
					{
						required: true,
						type: "number",
						message: "芝麻信用分为必填",
						trigger: "change"
					}
				],
			}
		};
	},
	created() {
	},
	mounted() {
		this.fetchApplicantInfo();
	},
	methods: {
		handleSave({ type, cb }) {
			this.handleSubmit(true, '', type, cb);
		},
		handleEdit() {
			this.isPrint = false;
		},
		handleCancel() {
			this.isPrint = true;
		},
		validatorTime(rule, value, callback) {
			if (value[0] instanceof Date
				&& value[1] instanceof Date) {
				callback();
			} else {
				callback(new Error('请选择时间'));
			}
		},
		validatorRegion(rule, value, callback) {
			if (this.formValidate.region[0]) {
				callback();
			} else {
				callback(new Error('籍贯为必选'));
			}
		},
		handlePrint: lodash.debounce(function (event) {
			this.handleSubmit(false, this.$refs.pageTarget.print);
		}, 300),

		handleSubmit(isSave, doPrint, type, cb) {
			this.$refs.form.validateAndScroll(isValid => {
				if (isValid) {
					if (this.formValidate.edu_experience && this.formValidate.edu_experience.length > 0) {
						this.formValidate.edu_experience = this.formValidate.edu_experience.map(item => {
							item.edu_start_time = moment(
								item.edu_time[0]
							).format("YYYY-MM-DD");
							item.edu_end_time = moment(
								item.edu_time[1]
							).format("YYYY-MM-DD");
							return item;
						});
					}
					if (this.formValidate.job_experience && this.formValidate.job_experience.length > 0) {
						this.formValidate.job_experience = this.formValidate.job_experience.map(item => {
							item.job_start_time = moment(
								item.job_time[0]
							).format("YYYY-MM-DD");
							item.job_end_time = moment(
								item.job_time[1]
							).format("YYYY-MM-DD");
							return item;
						});
					}
					this.formValidate.birthday = moment(this.formValidate.birthday).format(
						"YYYY-MM-DD"
					);
					this.formValidate.graduate_time = moment(
						this.formValidate.graduate_time
					).format("YYYY-MM");
					this.formValidate.social_suspension_date = moment(
						this.formValidate.social_suspension_date
					).format("YYYY-MM");
					this.$request({
						url: API_ROOT._HR_EMPLOYEE_SUMMARY_RESUME_RESUME_POST,
						type: "POST",
						param: {
							type,
							applicant_id: this.$route.query.applicant_id,
							...this.formValidate,
							province: this.formValidate.region[0],
							city: this.formValidate.region[1],
							birthday: this.formValidate.birthday,
							graduate_time: this.formValidate.graduate_time
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						if (isSave) {
							cb();
							this.isPrint = true;
							this.fetchApplicantInfo();
						} else {
							this.info = this.formValidate;
							this.$forceUpdate();
							doPrint();
						}
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},

		fetchApplicantInfo() {
			let applicantId = this.$route.query;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_CHECK_RESUME_GET,
				type: "GET",
				param: {
					applicant_id: this.$route.query.applicant_id
				},
				loading: false
			}).then(res => {
				if (res.data.length != 0) {
					if (res.data.edu_experience && res.data.edu_experience.length > 0) {
						res.data.edu_experience.forEach(item => {
							item.edu_time = [item.edu_start_time, item.edu_end_time];
						});
					}
					if (res.data.job_experience && res.data.job_experience.length > 0) {
						res.data.job_experience.forEach(item => {
							item.job_time = [item.job_start_time, item.job_end_time];
						});
					}
					if (res.data.constellation_name) {
						res.data.constellation = res.data.constellation_name;
					}
					this.formValidate = res.data;
					this.old = lodash.cloneDeep(this.formValidate);
					if (res.data.province || res.data.province === 0) {
						this.formValidate.region = [res.data.province, res.data.city];
					}
					this.info = res.data;
				}
			}).catch(err => {});
		}
	}
};
</script>

<style lang="scss" >
.v-hr-summary-resume {
	height: inherit;
	overflow: auto;
    padding-bottom: 68px;
    .ivu-radio-wrapper {
        margin-right: 35px;
    }
    .ivu-input[disabled],
    fieldset[disabled] .ivu-input {
        color: #333 !important;
    }
    ._form {
        .__height {
            position: relative;
            .__cm {
                position: absolute;
                font-size: 13px;
                right: 54px;
                top: 0px;
            }
        }
        .__education {
			margin-left: -20px;
			padding:20px 0px 0px 20px;
            background-color: #fafafa;
            position: relative;
			margin-bottom:10px;
        }
        .__do {
            .__add {
                display: inline-block;
                font-size: 14px;
                margin-left: 24px;
            }
        }
        .__del {
            position: absolute;
            top: 6px;
            right: 46px;
            display: inline-block;
        }
    }
    footer {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 999;
        background-color: #ffffff;
        width: 100%;
        height: 60px;
        box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
    }
	.v-hr-resume-title ._name {
		color: #E84C57;
	}
	.v-hr-resume-title {
		margin-left: 30px;
	}
}
</style>
