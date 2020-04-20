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
				<oa-title title="个人资料"/>
				<i-row>
					<i-col span="12">
						<i-form-item label="姓名:" prop="applicant_name">
							<i-input
								v-model="formValidate.applicant_name"
								:maxlength="10"
								style="width:300px"
								placeholder="请输入姓名"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="性别:" prop="sex">
							<i-radio-group v-model="formValidate.sex">
								<i-radio label="0">男</i-radio>
								<i-radio label="1">女</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
					<i-col span="12" class="__height">
						<i-form-item label="身高:" prop="height">
							<i-input
								v-model="formValidate.height"
								:maxlength="3"
								style="width:300px"
								placeholder="请输入身高"
							/>
							<span class="__cm">cm</span>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="血型:" prop="blood">
							<i-select 
								v-model="formValidate.blood" 
								clearable
								placeholder="请选择血型" 
								style="width:300px">
								<i-option
									v-for="(item, index) in bloodArray"
									:key="index"
									:value="item.value"
								>
									{{ item.label }}
								</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="爱好/特长:" prop="hobby">
							<i-input
								v-model="formValidate.hobby"
								:maxlength="20"
								style="width:300px"
								placeholder="请输入爱好/特长"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="应聘职位:" prop="position_id">
							<i-cascader
								v-model="formValidate.position_id"
								:data="departPosition"
								change-on-select
								style="width:300px; display: inline-block"
								clearable
								filterable
								transfer
								trigger="hover"
								placeholder="请选择应聘职位"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="期望薪资:" prop="salary">
							<i-input
								v-model="formValidate.salary"
								:maxlength="20"
								style="width:300px"
								placeholder="请输入期望薪资元/月"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="手机号码:" prop="mobile">
							<i-input
								v-model="formValidate.mobile"
								:maxlength="11"
								style="width:300px"
								placeholder="请输入手机号码"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="微信号:" prop="wechat">
							<i-input
								v-model="formValidate.wechat"
								:maxlength="20"
								style="width:300px"
								placeholder="请输入微信号"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="邮箱:" prop="email">
							<i-input
								v-model="formValidate.email"
								:maxlength="50"
								style="width:300px"
								placeholder="请输入邮箱"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<oa-title title="身份信息"/>
				<div class="g-flex-cc g-jc-sb g-ai-fs g-fw-w">
					<i-form-item label="身份证号:" prop="id_card">
						<i-input
							v-model="formValidate.id_card"
							:maxlength="18"
							style="width:300px"
							placeholder="请输入身份证号"
						/>
					</i-form-item>
					<i-form-item label="民族:" prop="nation_id" style="width:50%">
						<i-select
							v-model="formValidate.nation_id"
							clearable
							style="width:300px"
							placeholder="请选择民族"
						>
							<i-option
								v-for="(item, index) in nations"
								:key="index"
								:value="item.value"
							>
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="生日类型:" prop="birthday_type" style="width:50%">
						<i-radio-group v-model="formValidate.birthday_type">
							<i-radio label="0">公历</i-radio>
							<i-radio label="1">农历</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item label="公历生日:" prop="birthday" style="width:50%">
						<i-date-picker
							v-model="formValidate.birthday"
							style="width:300px"
							type="date"
							format="yyyy-MM-dd"
							placeholder="请选择公历生日"
							@on-change="handleChange"
						/>
					</i-form-item>
					<i-form-item label="星座:" style="width:50%">
						<i-input
							v-model="formValidate.constellation"
							:maxlength="20"
							disabled
							style="width:300px"
							placeholder="暂无星座信息"
						/>
					</i-form-item>
					<i-form-item label="婚否:" prop="is_married" style="width:50%">
						<i-radio-group v-model="formValidate.is_married">
							<i-radio label="0">未婚</i-radio>
							<i-radio label="1">已婚</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item label="籍贯:" prop="region" style="width:50%">
						<i-cascader
							v-model="formValidate.region"
							:data="region"
							style="width: 300px; display: inline-block"
							clearable
							transfer
							trigger="hover"
							placeholder="请选择籍贯"
							@on-change="handleRegion"
						/>
					</i-form-item>
					<i-form-item label="户口地址:" prop="address" style="width:50%">
						<oa-limit-words
							v-model="formValidate.address"
							:max="50"
							style="width:300px"
							placeholder="请输入身份证上的地址"
						/>
					</i-form-item>
					<i-form-item label="现住地址:" prop="now_address" style="width:50%">
						<oa-limit-words
							v-model="formValidate.now_address"
							:max="50"
							style="width:300px"
							placeholder="请输入现住地址"
						/>
					</i-form-item>
					<i-form-item label="健康状况：" style="width:50%">
						<i-input
							v-model="formValidate.health_condition"
							:maxlength="10"
							style="width: 300px"
							placeholder="请输入健康状况"
						/>
					</i-form-item>
					<i-form-item label="重大病史:" prop="has_medical_history" style="width:50%">
						<i-radio-group v-model="formValidate.has_medical_history">
							<i-radio label="1">有</i-radio>
							<i-radio label="2" style="margin-left:50px">无</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item 
						v-if="formValidate.has_medical_history=='1'" 
						label="病史说明:" 
						prop="medical_history"
						style="width:50%">
						<oa-limit-words
							v-model="formValidate.medical_history"
							:max="200"
							style="width:300px"
							placeholder="请详细说明情况，便于工作岗位和强度安排"
						/>
					</i-form-item>
				</div>
				<oa-title title="教育信息"/>
				<i-row>
					<i-col span="12">
						<i-form-item label="毕业院校:" prop="college">
							<i-input
								v-model="formValidate.college"
								:maxlength="55"
								style="width:300px"
								placeholder="请输入毕业院校"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="学历:" prop="education">
							<i-select
								v-model="formValidate.education"
								clearable
								style="width:300px"
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
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="毕业时间:" prop="graduate_time">
							<i-date-picker
								v-model="formValidate.graduate_time"
								style="width:300px"
								type="month"
								format="yyyy-MM"
								placeholder="请选择毕业时间"
								@on-change="formValidate.graduate_time=$event"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="专业:" prop="profession">
							<i-input
								v-model="formValidate.profession"
								:maxlength="20"
								style="width:300px"
								placeholder="请输入专业"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<oa-title title="其他信息"/>
				<i-row>
					<i-col span="12">
						<i-form-item label="紧急联系人:" prop="important_name">
							<i-input
								v-model="formValidate.important_name"
								:maxlength="10"
								style="width:300px"
								placeholder="请输入紧急联系人"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="紧急联系人电话:" prop="important_phone">
							<i-input
								v-model="formValidate.important_phone"
								:maxlength="11"
								style="width:300px"
								placeholder="请输入紧急联系人电话"
							/>
						</i-form-item>
					</i-col>
					<!-- <i-col span="12">
						<i-form-item label="个人特长:" prop="specially">
							<i-input
								v-model="formValidate.specially"
								:maxlength="20"
								style="width:300px"
								placeholder="请输入个人特长"
							/>
						</i-form-item>
					</i-col> -->
					<i-col span="12">
						<i-form-item label="外语能力:" prop="english_skills">
							<i-select
								v-model="formValidate.english_skills"
								clearable
								style="width:300px"
								placeholder="请选择外语能力"
							>
								<i-option
									v-for="(item, index) in skillLevel"
									:key="index"
									:value="item.value"
								>
									{{ item.label }}
								</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="计算机能力:" prop="computer_skills">
							<i-select
								v-model="formValidate.computer_skills"
								clearable
								style="width:300px"
								placeholder="请选择计算机能力"
							>
								<i-option
									v-for="(item, index) in skillLevel"
									:key="index"
									:value="item.value"
								>
									{{ item.label }}
								</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="对前台印象:" prop="front_impression">
							<i-select
								v-model="formValidate.front_impression"
								clearable
								style="width:300px"
								placeholder="请选择对前台印象"
							>
								<i-option
									v-for="(item, index) in impression"
									:key="index"
									:value="item.value"
								>
									{{ item.label }}
								</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="上家社保单位：" prop="last_social_company">
							<i-input
								v-model="formValidate.last_social_company"
								:maxlength="50"
								style="width: 300px"
								placeholder="请输入上家社保单位"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="社保停缴月：" prop="social_suspension_date">
							<i-date-picker
								v-model="formValidate.social_suspension_date"
								:split-panels="true"
								style="width: 300px"
								placeholder="请选择社保停缴月"
								type="month"
								transfer
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="芝麻信用分：" prop="ali_sesame_credit">
							<i-input-number
								v-model="formValidate.ali_sesame_credit"
								:max="9999"
								style="width: 300px"
								placeholder="请输入数字"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<div class="g-flex g-flex-ac __do">
					<oa-title title="教育经历"/>
					<span
						v-if="formValidate.edu_experience.length<3"
						class="g-operation __add"
						@click="handleAddEdu"
					>添加</span>
				</div>
				<div
					v-for="(item, index) in formValidate.edu_experience"
					:key="index"
					class="__education"
				>
					<span class="g-operation __del" @click="handleEducationDel(index)">删除</span>
					<i-row style="marginTop:10px">
						<i-col span="12">
							<i-form-item
								:prop="'edu_experience.' + index + '.edu_school'"
								:rules="ruleValidate.edu_school"
								label="学校/培训:"
							>
								<i-input
									v-model="item.edu_school"
									:maxlength="55"
									style="width:300px"
									placeholder="请输入学校或培训信息"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'edu_experience.' + index + '.edu_course'"
								:rules="ruleValidate.edu_course"
								label="专业/课程:"
							>
								<i-input
									v-model="item.edu_course"
									:maxlength="20"
									style="width:300px"
									placeholder="请输入专业信息"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'edu_experience.' + index + '.edu_certificate'"
								:rules="ruleValidate.edu_certificate"
								label="获得证书:"
							>
								<i-input
									v-model="item.edu_certificate"
									:maxlength="20"
									style="width:300px"
									placeholder="请输入证书信息"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'edu_experience.' + index + '.edu_time'"
								:rules="ruleValidate.edu_time"
								label="教育时间:"
							>
								<i-date-picker
									v-model="item.edu_time"
									format="yyyy-MM-dd"
									style="width:300px"
									type="daterange"
									placeholder="请选择教育时间"
								/>
							</i-form-item>
						</i-col>
					</i-row>
				</div>
				<div class="g-flex g-flex-ac __do">
					<oa-title title="工作经历"/>
					<span
						v-if="formValidate.job_experience.length<3"
						class="g-operation __add"
						@click="handleAddJob"
					>添加</span>
				</div>
				<div
					v-for="(item, index) in formValidate.job_experience"
					:key="index+'a'"
					class="__education"
				>
					<span class="g-operation __del" @click="handleJobDel(index)">删除</span>
					<i-row style="marginTop:10px">
						<i-col span="12">
							<i-form-item
								:prop="'job_experience.' + index + '.job_company_name'"
								:rules="ruleValidate.job_company_name"
								label="公司名称:"
							>
								<i-input
									v-model="item.job_company_name"
									:maxlength="20"
									style="width:300px"
									placeholder="请输入公司名称"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'job_experience.' + index + '.job_position'"
								:rules="ruleValidate.job_position"
								label="职位:"
							>
								<i-input
									v-model="item.job_position"
									:maxlength="20"
									style="width:300px"
									placeholder="请输入职位信息"
								/>
							</i-form-item>
						</i-col>
					</i-row>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'job_experience.' + index + '.job_salary'"
								:rules="ruleValidate.job_salary"
								label="月收入:"
							>
								<i-input
									v-model="item.job_salary"
									:maxlength="11"
									style="width:300px"
									placeholder="请输入月收入信息"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'job_experience.' + index + '.job_time'"
								:rules="ruleValidate.job_time"
								label="工作时间:"
							>
								<i-date-picker
									v-model="item.job_time"
									format="yyyy-MM-dd"
									style="width:300px"
									type="daterange"
									placeholder="请选择工作时间"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item 
								:prop="'job_experience.' + index + '.job_superior'"
								:rules="ruleValidate.job_superior"
								label="直接上司:"
							>
								<i-input
									v-model="item.job_superior"
									:maxlength="10"
									style="width:300px"
									placeholder="请输入直接上司"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item 
								:prop="'job_experience.' + index + '.job_superior_phone'" 
								:rules="ruleValidate.job_superior_phone"
								label="上司联系方式:"
							>
								<i-input
									v-model="item.job_superior_phone"
									:maxlength="20"
									style="width:300px"
									placeholder="请输入上司联系方式"
								/>
							</i-form-item>
						</i-col>
					</i-row>
					<i-row>
						
						<i-col span="12">
							<i-form-item 
								:prop="'job_experience.' + index + '.job_superior_position'"
								:rules="ruleValidate.job_superior_position" 
								label="直接上司职位:">
								<i-input
									v-model="item.job_superior_position"
									:maxlength="20"
									style="width:300px"
									placeholder="请输入直接上司职位"
								/>
							</i-form-item>
						</i-col>
					</i-row>
				</div>
			</i-form>
		</div>
		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print :info="info"/>
			</vc-print>
		</div>
		<footer v-if="!is_person" class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="$router.back()">取消</div>
			<div
				style="display: inline-block;"
				class="g-m-r-10 g-red-btn-small"
				@click="handleSubmit(true,null)"
			>
				提交
			</div>
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
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	DatePicker,
	Cascader,
	Message,
	Row,
	Col,
	RadioGroup,
	Radio,
	Button
} from "iview";
// utils
import lodash from "lodash";
import moment from "moment";
import { dataValidity, getHashUrl } from "@utils/utils";
import { ImgsPicker, Print } from "wya-vc";
import { services } from "@stores/services/hr";
import LimitWords from '@components/_common/limit-words/limit-words';
import { services as commonServices } from '@stores/services/common';
import Title from "../_common/title";
import ResumePrint from "./print";

export default {
	name: "v-hr-summary-resume",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"i-cascader": Cascader,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-button": Button,
		"oa-title": Title,
		"oa-print": ResumePrint,
		'oa-limit-words': LimitWords,
		"vc-print": Print
	},
	mixins: [
		services.bloodArray(),
		services.departPosition(),
		services.constellation(),
		services.nations(),
		services.education(),
		services.skillLevel(),
		services.impression(),
		commonServices.region()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			info: {},
			is_person: !!query.from,
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
				specially: "", // 个人特长
				english_skills: "", // 外语能力
				computer_skills: "", // 计算机能力
				front_impression: "", // 对前台的印象
				edu_experience: [],
				job_experience: [],
				ali_sesame_credit: '',
				last_social_company: '',
				social_suspension_date: '',
				health_condition: '',
				has_medical_history: '',
				medical_history: ''
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
				specially: [{ required: true, message: "个人特长为必填" }],
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
				social_suspension_date: [
					// {
					// 	required: true,
					// 	pattern: /.+/,
					// 	message: "社保停缴时间为必选",
					// 	trigger: "change"
					// }
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
			}
		};
	},
	created() {
	},
	mounted() {
		this.loadApplicantInfo();
	},
	methods: {
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
		handleAddEdu() {
			this.formValidate.edu_experience.push({
				edu_school: "", // 培训或学校
				edu_course: "", // 课程或专业
				edu_certificate: "", // 获得证书
				edu_time: []
			});
		},
		handleAddJob() {
			this.formValidate.job_experience.push({
				job_company_name: "", //
				job_position: "", // 职位
				job_salary: null, // 月收入
				job_time: [],
				job_superior: "", // 直接上司
				job_superior_phone: null, // 直接上司手机号
				job_superior_position: ""
			});
		},
		handleEducationDel(index) {
			this.formValidate.edu_experience.splice(index, 1);
		},
		handleJobDel(index) {
			this.formValidate.job_experience.splice(index, 1);
		},
		handleChange(data) {
			let month = data.slice(5, 7);
			let day = data.slice(8, 10);
			this.getAstro(month, day);
		},
		handleRegion(value) {
			if (value.length == 0) {
				this.formValidate.city = 0;
				this.formValidate.province = 0;
			}
			this.formValidate.region = value;
			this.$forceUpdate();
		},
		getAstro(month, day) {
			let s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
			let arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
			this.formValidate.constellation = s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + "座";
			return this.formValidate.constellation;
		},
		handlePrint: lodash.debounce(function (event) {
			this.handleSubmit(false, this.$refs.pageTarget.print);
		}, 300),

		handleSubmit: lodash.debounce(function (isSave, doPrint) {
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
					this.formValidate.social_suspension_date = moment(this.formValidate.social_suspension_date).format(
						"YYYY-MM"
					);
					this.$request({
						url: API_ROOT._HR_EMPLOYEE_SUMMARY_RESUME_RESUME_POST,
						type: "POST",
						param: {
							applicant_id: this.$route.query.applicant_id,
							...this.formValidate,
							province: this.formValidate.region[0],
							city: this.formValidate.region[1],
							birthday: this.formValidate.birthday,
							graduate_time: this.formValidate.graduate_time,
							social_suspension_date: this.formValidate.social_suspension_date
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						if (isSave) {
							this.$router.go(-1);
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
		}, 300),

		loadApplicantInfo() {
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
					if (res.data.province) {
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
            font-size: 14px;
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
}
</style>
