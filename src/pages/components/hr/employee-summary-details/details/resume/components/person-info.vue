<template>
	<div class="g-flex g-fd-c">
		<i-form
			ref="form1"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="center"
		>
			<div class="g-flex g-flex-ac">
				<oa-title title="个人资料"/>
				<div
					v-if="($auth['209']||($auth['678']&&$auth['679']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit"
				>
					<span v-if="infoStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(1,'infoStatus')">保存</span>
						<span @click="handleCancel(1,'infoStatus')">取消</span>		
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
			</div>
			<i-row v-if="infoStatus">
				<i-col span="12">
					<i-form-item label="姓名：" prop="applicant_name">
						<i-input
							v-model="formValidate.applicant_name"
							:maxlength="10"
							style="width: 300px"
							placeholder="请输入姓名"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="性别：" prop="sex">
						<i-radio-group v-model="formValidate.sex">
							<i-radio label="0">男</i-radio>
							<i-radio label="1">女</i-radio>
						</i-radio-group>
					</i-form-item>
				</i-col>
				<i-col span="12" class="_height">
					<i-form-item label="身高：" prop="height">
						<i-input
							v-model="formValidate.height"
							:maxlength="3"
							style="width: 300px"
							placeholder="请输入身高"
						/>
						<span class="__cm">cm</span>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="血型：" prop="blood">
						<i-select 
							v-model="formValidate.blood" 
							clearable 
							placeholder="请选择血型" 
							style="width: 300px"
						>
							<i-option
								v-for="(item, index) in bloodArray"
								:key="index"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="爱好/特长：" prop="hobby">
						<i-input
							v-model="formValidate.hobby"
							:maxlength="20"
							style="width: 300px"
							placeholder="请输入爱好/特长"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="应聘职位：" prop="position_id">
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
					<i-form-item label="期望薪资：" prop="salary">
						<i-input
							v-model="formValidate.salary"
							:maxlength="20"
							style="width: 300px"
							placeholder="请输入期望薪资元/月"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="手机号码：" prop="mobile">
						<i-input
							v-model="formValidate.mobile"
							:maxlength="11"
							style="width: 300px"
							placeholder="请输入手机号码"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="微信号：" prop="wechat">
						<i-input
							v-model="formValidate.wechat"
							:maxlength="20"
							style="width: 300px"
							placeholder="请输入微信号"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="邮箱：" prop="email">
						<i-input
							v-model="formValidate.email"
							:maxlength="50"
							style="width: 300px"
							placeholder="请输入邮箱"
						/>
					</i-form-item>
				</i-col>
			</i-row>
			<div v-else class="_oaitem">
				<oa-item label="姓名">{{ formValidate.applicant_name }}</oa-item>
				<oa-item label="性别">{{ formValidate.sex == 0 ? '男' : '女' }}</oa-item>
				<oa-item label="身高">{{ formValidate.height?formValidate.height +'cm':'' }}</oa-item>
				<oa-item label="血型">{{ formValidate.blood_name }}</oa-item>
				<oa-item label="爱好/特长">{{ formValidate.hobby }}</oa-item>
				<oa-item label="应聘职位">{{ formValidate.position_name }}</oa-item>
				<oa-item label="期望薪资">{{ formValidate.salary }}</oa-item>
				<oa-item label="手机号码">{{ formValidate.mobile }}</oa-item>
				<oa-item label="微信号">{{ formValidate.wechat }}</oa-item>
				<oa-item label="邮箱">{{ formValidate.email }}</oa-item>
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
	DatePicker,
	Message,
	Cascader,
	Row,
	Col,
	RadioGroup,
	Radio
} from "iview";
// utils
import moment from "moment";
import { dataValidity, getHashUrl, unCode } from "@utils/utils";
import { ImgsPicker } from "wya-vc";
import { services } from "@stores/services/hr";
import { log } from "util";
import { services as commonServices } from '@stores/services/common';
import LimitWords from '@components/_common/limit-words/limit-words';
import Title from "../../../../_common/title";
import DetailItem from "../../detail-item";

export default {
	name: "oa-hr-summary-details-person-info",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"i-cascader": Cascader,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"oa-title": Title,
		"oa-item": DetailItem
	},
	mixins: [
		services.bloodArray(),
		services.departPosition()
	],
	props: {
		dateObj: {
			type: Object
		},
	},
	data() {
		const { query } = this.$route;
		return {
			infoStatus: false,
			queryStaffStatus: query.staff_status,
			formValidate: this.dateObj,
			ruleValidate: {
				applicant_name: [
					{
						required: true,
						message: "姓名为必填"
					},
					{ type: 'validCompellation', 
						message: '请输入正确的姓名', 
						validator: dataValidity, 
						trigger: "blur"
					}
				],
				sex: [
					{
						required: true,
						message: "性别为必选",
						trigger: "change"
					}
				],
				position_id: [
					{
						required: true,
						type: "array",
						message: "应聘职位为必选",
						trigger: "change"
					}
				],
				height: [
					{
						required: false
					},
					{
						type: "validNum",
						message: "请输入数字",
						validator: dataValidity
					}
				],
				salary: [
					{
						required: true,
						message: "期望薪资为必填"
					}
				],
				mobile: [
					{
						required: true,
						message: "手机号码为必填"
					},
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				wechat: [
					{
						required: true,
						message: "微信号为必填"
					}
				],
				email: [
					{
						required: true,
						message: "邮箱必填",
						trigger: "blur"
					},
					{
						type: "email",
						message: "邮箱格式错误",
						trigger: "blur"
					}
				],
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
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_RESUME_RESUME_POST,
				type: "POST",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					...this.formValidate,
					type,
					province: this.formValidate.region[0],
					city: this.formValidate.region[1],
					birthday: moment(this.formValidate.birthday).format(
						"YYYY-MM-DD"
					),
					graduate_time: moment(
						this.formValidate.graduate_time
					).format("YYYY-MM")
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
		handleEdit() {
			this.infoStatus = true;
		},
	}
};
</script>

 