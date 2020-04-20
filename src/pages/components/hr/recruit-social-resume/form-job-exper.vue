<template>
	<div>
		<div class="g-flex g-flex-ac __do">
			<oa-title title="工作经历" class="v-hr-resume-title" />
			<div class="g-m-l-20">
				<span v-if="!edit" class="g-operation" @click="handleEdit">编辑</span>
				<template v-else>
					<span class="g-operation" @click="handleCancel">取消</span>
					<span class="g-operation g-m-l-10" @click="handleSave">保存</span>
					<span
						v-if="formValidate.job_experience.length<3"
						class="g-operation g-m-l-10"
						@click="handleAddJob">添加</span>
				</template>
			</div>
		</div>
		<div v-for="(item, index) in formValidate.job_experience" :key="index+'a'" class="__education">
			<span class="g-operation __del" @click="handleJobDel(index)">删除</span>
			<i-row style="marginTop:10px">
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="item.job_company_name"
						:prop="'job_experience.' + index + '.job_company_name'"
						:rules="rules.job_company_name"
						label="公司名称:">
						<i-input v-model="item.job_company_name" :maxlength="20" style="width:300px" placeholder="请输入公司名称" />
					</oa-form-item>
				</i-col>
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="item.job_position"
						:prop="'job_experience.' + index + '.job_position'"
						:rules="rules.job_position"
						label="职位:">
						<i-input v-model="item.job_position" :maxlength="20" style="width:300px" placeholder="请输入职位信息" />
					</oa-form-item>
				</i-col>
			</i-row>
			<i-row>
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="item.job_salary"
						:prop="'job_experience.' + index + '.job_salary'"
						:rules="rules.job_salary"
						label="月收入:">
						<i-input v-model="item.job_salary" :maxlength="11" style="width:300px" placeholder="请输入月收入信息" />
					</oa-form-item>
				</i-col>
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="`${item.job_start_time} ~ ${item.job_end_time}`"
						:prop="'job_experience.' + index + '.job_time'"
						:rules="rules.job_time"
						label="工作时间:">
						<i-date-picker
							v-model="item.job_time"
							format="yyyy-MM-dd"
							style="width:300px"
							type="daterange"
							placeholder="请选择工作时间" />
					</oa-form-item>
				</i-col>
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="item.job_superior"
						:prop="'job_experience.' + index + '.job_superior'"
						:rules="rules.job_superior"
						label="直接上司:">
						<i-input v-model="item.job_superior" :maxlength="10" style="width:300px" placeholder="请输入直接上司" />
					</oa-form-item>
				</i-col>
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="item.job_superior_phone"
						:prop="'job_experience.' + index + '.job_superior_phone'"
						:rules="rules.job_superior_phone"
						label="上司联系方式:">
						<i-input v-model="item.job_superior_phone" :maxlength="20" style="width:300px" placeholder="请输入上司联系方式" />
					</oa-form-item>
				</i-col>
			</i-row>
			<i-row>

				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="item.job_superior_position"
						:prop="'job_experience.' + index + '.job_superior_position'"
						:rules="rules.job_superior_position"
						label="直接上司职位:">
						<i-input v-model="item.job_superior_position" :maxlength="20" style="width:300px" placeholder="请输入直接上司职位" />
					</oa-form-item>
				</i-col>
			</i-row>
		</div>
	</div>
</template>

<script>
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
} from 'iview';
import { services } from "@stores/services/hr";
import Title from "../_common/title";
import Item from './item';

export default {
	name: 'hr-recruit-social-resume',
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
		"oa-form-item": Item
	},
	mixins: [
		services.bloodArray()
	],
	props: {
		formValidate: Object,
		rules: Object,
		old: Object
	},
	data() {
		return {
			edit: false,
		};
	},
	methods: {
		handleEdit() {
			this.edit = true;
			this.$emit('edit');
		},
		handleCancel() {
			this.edit = false;
			this.$emit('cancel');
		},
		handleSave() {
			this.$emit('save', {
				type: 6,
				cb: () => {
					this.edit = false;
				}
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
		handleJobDel(index) {
			this.formValidate.job_experience.splice(index, 1);
		},
	}
};
</script>

<style lang="scss">
</style>


