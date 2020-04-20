<template>
	<div>
		<div class="g-flex g-flex-ac __do">
			<oa-title title="教育经历" class="v-hr-resume-title" />
			<div class="g-m-l-20">
				<span v-if="!edit" class="g-operation" @click="handleEdit">编辑</span>
				<template v-else>
					<span class="g-operation" @click="handleCancel">取消</span>
					<span class="g-operation g-m-l-10" @click="handleSave">保存</span>
					<span
						v-if="formValidate.edu_experience.length < 3"
						class="g-operation g-m-l-10"
						@click="handleAddEdu">添加</span>
				</template>
			</div>
		</div>
		<div
			v-for="(item, index) in formValidate.edu_experience"
			:key="index"
			class="__education">
			<span class="g-operation __del" @click="handleEducationDel(index)">删除</span>
			<i-row style="marginTop:10px">
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="item.edu_school"
						:prop="'edu_experience.' + index + '.edu_school'"
						:rules="rules.edu_school"
						label="学校/培训:">
						<i-input v-model="item.edu_school" :maxlength="55" style="width:300px" placeholder="请输入学校或培训信息" />
					</oa-form-item>
				</i-col>
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="item.edu_course"
						:prop="'edu_experience.' + index + '.edu_course'"
						:rules="rules.edu_course"
						label="专业/课程:">
						<i-input v-model="item.edu_course" :maxlength="20" style="width:300px" placeholder="请输入专业信息" />
					</oa-form-item>
				</i-col>
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="item.edu_certificate"
						:prop="'edu_experience.' + index + '.edu_certificate'"
						:rules="rules.edu_certificate"
						label="获得证书:">
						<i-input v-model="item.edu_certificate" :maxlength="20" style="width:300px" placeholder="请输入证书信息" />
					</oa-form-item>
				</i-col>
				<i-col span="12">
					<oa-form-item
						:edit="edit"
						:content="`${item.edu_start_time} ~ ${item.edu_end_time}`"
						:prop="'edu_experience.' + index + '.edu_time'"
						:rules="rules.edu_time"
						label="教育时间:">
						<i-date-picker
							v-model="item.edu_time"
							format="yyyy-MM-dd"
							style="width:300px"
							type="daterange"
							placeholder="请选择教育时间" />
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
				type: 5,
				cb: () => {
					this.edit = false;
				}
			});
		},
		handleAddEdu() {
			this.formValidate.edu_experience.push({
				edu_school: "", // 培训或学校
				edu_course: "", // 课程或专业
				edu_certificate: "", // 获得证书
				edu_time: []
			});
		},
		handleEducationDel(index) {
			this.formValidate.edu_experience.splice(index, 1);
		},
	}
};
</script>

<style lang="scss">
</style>


