<template>
	<div class="g-flex g-fd-c">
		<i-form
			ref="form5"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="center"
		>
			<div class="g-flex g-flex-ac g-m-t-20 ">
				<oa-title title="教育经历"/>
				<div
					v-if="($auth['209']||($auth['678']&&$auth['679']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation g-fs-14"
					@click="handleEdit('教育经历')"
				>
					<span v-if="eduExpStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(5,'eduExpStatus')">保存</span>
						<span @click="handleCancel(5,'eduExpStatus')">取消</span>		
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
				<span
					v-if="formValidate.edu_experience&&formValidate.edu_experience.length<3 && eduExpStatus"
					class="g-operation _add g-fs-14"
					style="fontSize:14px !important"
					@click="handleAddEdu"
				>添加</span>
			</div>
			<div v-if="eduExpStatus">
				<div
					v-for="(item, index) in formValidate.edu_experience"
					:key="index"
					class="_education"
				>
					<span class="g-operation _del g-fs-14" @click="handleEducationDel(index)">删除</span>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'edu_experience.' + index + '.edu_school'"
								:rules="ruleValidate.edu_school"
								label="学校/培训："
							>
								<i-input
									v-model="item.edu_school"
									:maxlength="55"
									style="width: 300px"
									placeholder="请输入学校或培训信息"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'edu_experience.' + index + '.edu_course'"
								:rules="ruleValidate.edu_course"
								label="专业/课程："
							>
								<i-input
									v-model="item.edu_course"
									:maxlength="20"
									style="width: 300px"
									placeholder="请输入专业信息"
								/>
							</i-form-item>
						</i-col>
					</i-row>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'edu_experience.' + index + '.edu_certificate'"
								:rules="ruleValidate.edu_certificate"
								label="获得证书："
							>
								<i-input
									v-model="item.edu_certificate"
									:maxlength="20"
									style="width: 300px"
									placeholder="请输入证书信息"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'edu_experience.' + index + '.edu_time'"
								:rules="ruleValidate.edu_time"
								label="教育时间："
							>
								<i-date-picker
									v-model="item.edu_time"
									format="yyyy-MM-dd"
									style="width: 300px"
									type="daterange"
									placeholder="请选择教育时间"
								/>
							</i-form-item>
						</i-col>
					</i-row>
						
				</div>
			</div>
			<div v-else class="_oaitem">
				<div
					v-for="(item, index) in formValidate.edu_experience"
					:key="index"
					class="_edu"
				>
					<oa-item label="学校/培训">{{ item.edu_school }}</oa-item>
					<oa-item label="专业/课程">{{ item.edu_course }}</oa-item>
					<oa-item label="获得证书">{{ item.edu_certificate }}</oa-item>
					<oa-item label="教育时间">{{ item.edu_start_time }}~{{ item.edu_end_time }}</oa-item>
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
	name: "oa-hr-summary-details-edu-experience",
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
			eduExpStatus: false,
			formValidate: this.dateObj,
			queryStaffStatus: query.staff_status,
			ruleValidate: {
				type: 0,
				edu_school: [
					{
						required: true,
						message: "学校或培训信息为必填"
					}
				],
				edu_course: [
					{
						required: true,
						message: "专业或课程为必填"
					}
				],
				edu_certificate: [
					{
						required: true,
						message: "获得证书为必填"
					}
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
			}
		};
	},
	watch: {
		dateObj(value) {
			this.formValidate = value;
		}
	},
	methods: {
		handleAddEdu() {
			this.formValidate.edu_experience.push({
				edu_school: "", // 培训或学校
				edu_course: "", // 课程或专业
				edu_certificate: "", // 获得证书
				edu_time: []
			});
		},
		validatorTime(rule, value, callback) {
			if (value[0] instanceof Date 
				&& value[1] instanceof Date) {
				callback();
			} else {
				callback(new Error('请选择时间')); 
			}
		},
		handleEducationDel(index) {
			this.formValidate.edu_experience.splice(index, 1);
		},
		handleSubmit(type, name) {
			if (this.formValidate.edu_experience && this.formValidate.edu_experience.length == 0) {
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
			if (this.formValidate.edu_experience && this.formValidate.edu_experience.length > 0) {
				this.formValidate.edu_experience.map(item => {
					item.edu_start_time = moment(item.edu_time[0]).format(
						"YYYY-MM-DD"
					);
					item.edu_end_time = moment(item.edu_time[1]).format(
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
				if (res.data.edu_experience && res.data.edu_experience.length > 0) {
					res.data.edu_experience.forEach(item => {
						item.edu_time = [item.edu_start_time, item.edu_end_time];
					});
				}
				this.formValidate = { ...this.formValidate, ...res.data };
				this[name] = false;
			}).catch(err => {});
		},
		handleEdit(type) {
			this.eduExpStatus = true;
			this.formValidate.edu_experience && this.formValidate.edu_experience.length == 0 && this.handleAddEdu();
		},
	}
};
</script>
