<template>
	<div class="g-flex g-fd-c">
		<i-form
			ref="form6"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="center"
		>
			<div class="g-flex g-flex-ac g-m-t-20">
				<oa-title title="工作经历"/>
				<div
					v-if="($auth['209']||($auth['678']&&$auth['679']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit"
				>
					<span v-if="workExpStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(6,'workExpStatus')">保存</span>
						<span @click="handleCancel(6,'workExpStatus')">取消</span>		
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
				<span
					v-if="formValidate.job_experience&&formValidate.job_experience.length<3 && workExpStatus"
					class="g-operation _add g-fs-14"
					style="fontSize:14px !important"
					@click="handleAddJob"
				>添加</span>
			</div>
			<div v-if="workExpStatus">
				<div
					v-for="(item, index) in formValidate.job_experience"
					:key="index+'a'"
					class="_education"
				>
					<span class="g-operation _del g-fs-14" @click="handleJobDel(index)">删除</span>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'job_experience.' + index + '.job_company_name'"
								:rules="ruleValidate.job_company_name"
								label="公司名称："
							>
								<i-input
									v-model="item.job_company_name"
									:maxlength="20"
									style="width: 300px"
									placeholder="请输入公司名称"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'job_experience.' + index + '.job_position'"
								:rules="ruleValidate.job_position"
								label="职位："
							>
								<i-input
									v-model="item.job_position"
									:maxlength="20"
									style="width: 300px"
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
								label="月收入："
							>
								<i-input
									v-model="item.job_salary"
									:maxlength="11"
									style="width: 300px"
									placeholder="请输入月收入信息"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'job_experience.' + index + '.job_time'"
								:rules="ruleValidate.job_time"
								label="工作时间："
							>
								<i-date-picker
									v-model="item.job_time"
									format="yyyy-MM-dd"
									style="width: 300px"
									type="daterange"
									placeholder="请选择工作时间"
								/>
							</i-form-item>
						</i-col>
					</i-row>
					<i-row>
						<i-col span="12">
							<i-form-item 
								:prop="'job_experience.' + index + '.job_superior'"
								:rules="ruleValidate.job_superior"
								label="直接上司："
							>
								<i-input
									v-model="item.job_superior"
									:maxlength="10"
									style="width: 300px"
									placeholder="请输入直接上司"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'job_experience.' + index + '.job_superior_phone'"
								:rules="ruleValidate.job_superior_phone"
								label="上司联系方式："
							>
								<i-input
									v-model="item.job_superior_phone"
									:maxlength="11"
									style="width: 300px"
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
								label="直接上司职位：" 
							>
								<i-input
									v-model="item.job_superior_position"
									:maxlength="20"
									style="width: 300px"
									placeholder="请输入直接上司职位"
								/>
							</i-form-item>
						</i-col>
					</i-row>
				</div>
			</div>
			<div v-else class="_oaitem">
				<div
					v-for="(item, index) in formValidate.job_experience"
					:key="index+'a'"
					class="_edu"
				>
					<oa-item label="公司名称">{{ item.job_company_name }}</oa-item>
					<oa-item label="职位">{{ item.job_position }}</oa-item>
					<oa-item label="月收入">{{ item.job_salary }}</oa-item>
					<oa-item label="工作时间">{{ item.job_start_time }}~{{ item.job_end_time }}</oa-item>
					<oa-item label="直接上司">{{ item.job_superior }}</oa-item>
					<oa-item label="上司联系方式">{{ item.job_superior_phone }}</oa-item>
					<oa-item label="直接上司职位">{{ item.job_superior_position }}</oa-item>
				</div>
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
	DatePicker,
	Cascader,
	Message,
	Row,
	Col
} from "iview";
// utils
import moment from "moment";
import { dataValidity, getHashUrl, unCode } from "@utils/utils";
import Title from "../../../../_common/title";
import DetailItem from "../../detail-item";

export default {
	name: "oa-hr-summary-details-work-experience",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"oa-title": Title,
		"oa-item": DetailItem
	},
	props: {
		dateObj: {
			type: Object
		},
	},
	data() {
		const { query } = this.$route;
		return {
			workExpStatus: false,
			formValidate: this.dateObj,
			queryStaffStatus: query.staff_status,
			ruleValidate: {
				job_company_name: [
					{
						required: true,
						trigger: "blur",
						message: "公司名称为必填"
					}
				],
				job_position: [
					{
						required: true,
						trigger: "blur",
						message: "职位信息为必填"
					}
				],
				job_salary: [
					{
						required: false,
						message: "月收入为必填"
					}
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
					{
						required: true,
						trigger: "blur",
						message: "直接上司为必填"
					},
					{ type: 'validCompellation', 
						message: '请输入正确的姓名',
						validator: dataValidity,
						trigger: "blur"
					}
				],
				job_superior_phone: [
					{
						required: true,
						trigger: "blur",
						message: "上司联系方式为必填"
					},
					{
						type: "validContact",
						message: "联系格式不正确",
						validator: dataValidity
					}
				],
				job_superior_position: [
					{
						required: false,
						message: "直接上司职位为必填"
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
		validatorTime(rule, value, callback) {
			if (value[0] instanceof Date 
				&& value[1] instanceof Date) {
				callback();
			} else {
				callback(new Error('请选择时间')); 
			}
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
		handleJobDel(index) {
			this.formValidate.job_experience.splice(index, 1);
		},
		handleSubmit(type, name) {
			if (this.formValidate.job_experience && this.formValidate.job_experience.length == 0) {
				this.$refs[`form${type}`].validate();
				return this.handleFetch(type, name);
			} else {
				this.$refs[`form${type}`].validate(isValid => {
					if (isValid) {
						this.handleFetch(type, name);
					}
				});
			}
			
		},
		handleFetch(type, name) {
			if (this.formValidate.job_experience && this.formValidate.job_experience.length > 0) {
				this.formValidate.job_experience.map(item => {
					item.job_start_time = moment(item.job_time[0]).format(
						"YYYY-MM-DD"
					);
					item.job_end_time = moment(item.job_time[1]).format(
						"YYYY-MM-DD"
					);
					return item;
				});
			}
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
				if (res.data.job_experience && res.data.job_experience.length > 0) {
					res.data.job_experience.forEach(item => {
						item.job_time = [item.job_start_time, item.job_end_time];
					});
				}
				this.formValidate = { ...this.formValidate, ...res.data };
				this[name] = false;
			}).catch(err => {});
		},
		handleEdit(type) {
			this.workExpStatus = true;
			this.formValidate.job_experience && this.formValidate.job_experience.length == 0 && this.handleAddJob();
		},
	}
};
</script>

