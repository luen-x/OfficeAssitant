<template>
	<div class="g-flex g-fd-c">
		<i-form
			ref="form3"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="center"
		>
			<div class="g-flex g-flex-ac g-m-t-20">
				<oa-title title="教育信息"/>
				<div
					v-if="($auth['209']||($auth['678']&&$auth['679']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('教育信息')"
				>
					<span v-if="eduStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(3,'eduStatus')">保存</span>
						<span @click="handleCancel(3,'eduStatus')">取消</span>		
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
			</div>
			<i-row v-if="eduStatus">
				<i-col span="12">
					<i-form-item label="毕业院校：" prop="college">
						<i-input
							v-model="formValidate.college"
							:maxlength="55"
							style="width: 300px"
							placeholder="请输入毕业院校"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="学历：" prop="education">
						<i-select
							v-model="formValidate.education"
							clearable
							style="width: 300px"
							placeholder="请选择学历"
						>
							<i-option
								v-for="(item, index) in education"
								:key="index"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="毕业时间：" prop="graduate_time">
						<i-date-picker
							v-model="formValidate.graduate_time"
							format="yyyy-MM"
							style="width: 300px"
							type="month"
							placeholder="请选择毕业时间"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="专业：" prop="profession">
						<i-input
							v-model="formValidate.profession"
							:maxlength="20"
							style="width: 300px"
							placeholder="请输入专业"
						/>
					</i-form-item>
				</i-col>
			</i-row>
			<div v-else class="_oaitem">
				<oa-item label="毕业院校">{{ formValidate.college }}</oa-item>
				<oa-item label="学历">{{ formValidate.education_name }}</oa-item>
				<oa-item label="毕业时间">{{ formValidate.graduate_time }}</oa-item>
				<oa-item label="专业">{{ formValidate.profession }}</oa-item>
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
	Cascader,
	Message,
	Row,
	Col
} from "iview";
// utils
import moment from "moment";
import { dataValidity, getHashUrl, unCode } from "@utils/utils";
import { services } from "@stores/services/hr";
import LimitWords from '@components/_common/limit-words/limit-words';
import Title from "../../../../_common/title";
import DetailItem from "../../detail-item";

export default {
	name: "oa-hr-summary-details-educational-info",
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
		"oa-title": Title,
		'oa-limit-words': LimitWords,
		"oa-item": DetailItem
	},
	mixins: [
		services.education()
	],
	props: {
		dateObj: {
			type: Object
		},
	},
	data() {
		const { query } = this.$route;
		return {
			eduStatus: false,
			formValidate: this.dateObj,
			queryStaffStatus: query.staff_status,
			ruleValidate: {
				college: [
					{
						required: true,
						message: "毕业院校为必填"
					}
				],
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
						type: "date",
						message: "毕业时间为必选",
						trigger: "change"
					}
				],
				profession: [
					{
						required: true,
						message: "专业为必填"
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
					birthday: this.formValidate.birthday ? moment(this.formValidate.birthday).format(
						"YYYY-MM-DD"
					) : "",
					graduate_time: this.formValidate.graduate_time ? moment(
						this.formValidate.graduate_time
					).format("YYYY-MM") : ''
				},
				loading: false
			}).then(res => {
				// this[name] = false;
				this.fetchApplicantInfo(type, name);
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
			this.eduStatus = true;
		},
	}
};
</script>

