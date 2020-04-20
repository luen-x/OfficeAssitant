<template>
	<div class="g-flex g-fd-c">
		<i-form
			ref="form4"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="center"
		>
			<div class="g-flex g-flex-ac g-m-t-20">
				<oa-title title="其他信息"/>
				<div
					v-if="($auth['209']||($auth['678']&&$auth['679']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('其他信息')"
				>
					<span v-if="otherStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(4,'otherStatus')">保存</span>
						<span @click="handleCancel(4,'otherStatus')">取消</span>		
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
			</div>
			<i-row v-if="otherStatus">
				<i-col span="12">
					<i-form-item label="紧急联系人：" prop="important_name">
						<i-input
							v-model="formValidate.important_name"
							:maxlength="10"
							style="width: 300px"
							placeholder="请输入紧急联系人"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="紧急联系人电话：" prop="important_phone">
						<i-input
							v-model="formValidate.important_phone"
							:maxlength="11"
							style="width: 300px"
							placeholder="请输入紧急联系人电话"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="外语能力：" prop="english_skills">
						<i-select
							v-model="formValidate.english_skills"
							clearable
							style="width: 300px"
							placeholder="请选择外语能力"
						>
							<i-option
								v-for="(item, index) in skillLevel"
								:key="index"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="计算机能力：" prop="computer_skills">
						<i-select
							v-model="formValidate.computer_skills"
							clearable
							style="width: 300px"
							placeholder="请选择计算机能力"
						>
							<i-option
								v-for="(item, index) in skillLevel"
								:key="index"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="对前台印象：" prop="front_impression">
						<i-select
							v-model="formValidate.front_impression"
							clearable
							style="width: 300px"
							placeholder="请选择对前台印象"
						>
							<i-option
								v-for="(item, index) in impression"
								:key="index"
								:value="item.value"
							>{{ item.label }}</i-option>
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
			<div v-else class="_oaitem">
				<oa-item label="紧急联系人">{{ formValidate.important_name }}</oa-item>
				<oa-item label="紧急联系人电话">{{ formValidate.important_phone }}</oa-item>
				<!-- <oa-item label="个人特长">{{ formValidate.specially }}</oa-item> -->
				<oa-item label="外语能力">{{ formValidate.english_skills_name }}</oa-item>
				<oa-item label="计算机能力">{{ formValidate.computer_skills_name }}</oa-item>
				<oa-item label="对前台印象">{{ formValidate.front_impression_name }}</oa-item>
				<oa-item label="上家社保单位">{{ formValidate.last_social_company }}</oa-item>
				<oa-item label="社保停缴月">{{ formValidate.social_suspension_date || '--' }}</oa-item>
				<oa-item label="芝麻信用分">{{ formValidate.ali_sesame_credit }}</oa-item>
			</div>
		</i-form>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	Form,
	FormItem,
	Input,
	Select,
	Option,
	Cascader,
	Message,
	Row,
	Col,
	DatePicker,
	InputNumber
} from "iview";
// utils
import moment from "moment";
import { dataValidity, getHashUrl, unCode } from "@utils/utils";
import { services } from "@stores/services/hr";
import LimitWords from '@components/_common/limit-words/limit-words';
import Title from "../../../../_common/title";
import DetailItem from "../../detail-item";

export default {
	name: "oa-hr-summary-details-other-info",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-row": Row,
		"i-col": Col,
		"oa-title": Title,
		'oa-limit-words': LimitWords,
		"oa-item": DetailItem,
		"i-date-picker": DatePicker,
		"i-input-number": InputNumber,
	},
	mixins: [
		services.education(),
		services.skillLevel(),
		services.impression()
	],
	props: {
		dateObj: {
			type: Object
		},
	},
	data() {
		const { query } = this.$route;
		return {
			otherStatus: false,
			formValidate: this.dateObj,
			queryStaffStatus: query.staff_status,
			ruleValidate: {
				important_name: [
					{
						required: true,
						message: "紧急联系人为必填"
					},
					{ type: 'validCompellation', 
						message: '请输入正确的姓名',
						validator: dataValidity,
						trigger: "blur"
					}
				],
				important_phone: [
					{
						required: true,
						message: "紧急联系人电话为必填"
					},
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				specially: [
					{
						required: true,
						message: "个人特长为必填"
					}
				],
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
				]
			}
		};
	},
	watch: {
		dateObj(value) {
			this.formValidate = value;
		}
	},
	methods: {
		handleSubmit(type, name) {
			this.$refs[`form${type}`].validate(isValid => {
				if (isValid) {
					this.handleFetch(type, name);
				}
			});
		},
		handleFetch(type, name) {
			
			this.formValidate.birthday = this.formValidate.birthday ? moment(
				this.formValidate.birthday
			).format("YYYY-MM-DD") : "";
			this.formValidate.graduate_time = this.formValidate.graduate_time ? moment(
				this.formValidate.graduate_time
			).format("YYYY-MM") : '';
			this.formValidate.social_suspension_date = this.formValidate.social_suspension_date ? moment(
				this.formValidate.social_suspension_date
			).format("YYYY-MM") : '';
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_RESUME_RESUME_POST,
				type: "POST",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					...this.formValidate,
					type,
					province: this.formValidate.region[0],
					city: this.formValidate.region[1],
					birthday: this.formValidate.birthday,
					graduate_time: this.formValidate.graduate_time,
					social_suspension_date: this.formValidate.social_suspension_date
				},
				loading: false
			}).then(res => {
				this[name] = false;
				this.fetchApplicantInfo(type);
				// this.$router.replace(
				// 	getHashUrl("/hr/employee/summary/details", {
				// 		...this.$route.query,
				// 		name: Math.floor(Math.random() * 100)
				// 	})
				// );
				this.$Message.success(res.msg);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel(type, name) {
			this.fetchApplicantInfo(type, name);
		},
		fetchApplicantInfo(type, name) {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_CHECK_RESUME_GET,
				type: "GET",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					type
				},
				loading: false
			}).then(res => {
				this.formValidate = { ...this.formValidate, ...res.data };
				this[name] = false;
			}).catch(err => {});
		},
		handleEdit(type) {
			this.otherStatus = true;
		},
	}
};
</script>
