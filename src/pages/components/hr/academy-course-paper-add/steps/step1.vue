<template>
	<div class="g-pd-t-20 v-academy-course-paper-add-step1 ">
				
		<i-form 
			ref="form"
			:model="formData"
			:rules="rules" 
			:label-width="labelWidth" 
			style="	max-width: 850px;min-width: 450px;" 
		>
			<i-form-item
				label="试卷类型：" 
				prop="paper_type">
				<i-select 
					v-model="formData.paper_type"
					placeholder="试卷类型"
					style="width: 300px" 
					class="g-m-r-5"
					@on-change="handlePaperTypeChange"
				>
					<i-option :value="1">题目固定</i-option>
					<i-option :value="2">随机试卷</i-option>
				</i-select>
			</i-form-item>
			
			<i-form-item label="试卷名称：" prop="paper_name">
				<i-input 
					v-model="formData.paper_name" 
					:maxlength="30"
					placeholder="请输入试卷名称" 
					style="width:300px"
					clearable
				/>
			</i-form-item>

			<i-form-item label="试卷描述：" prop="paper_describe">
				<oa-limit-words :max="500" v-model="formData.paper_describe" width="520px" placeholder="请输入试卷考试要点，如：考核点，是否影响绩效、建议等提示信息"/>		
			</i-form-item>
			<i-form-item label="关联课题:" prop="subject_id">
				<i-cascader
					v-model="formData.subject_id"
					:data="subjectTree"
					clearable
					class="g-m-r-5"
					placeholder="请选择课题"
					style="width: 300px"
				/>
			</i-form-item>
		</i-form>
		
	</div>
</template>
<script>
import { Input, Button, Select, Option, Form, FormItem, Cascader } from 'iview';
import { services } from '@stores/services/hr';
import { debounce } from 'lodash';

export default {
	name: 'oa-add-paper-step1',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-cascader': Cascader,
	},
	mixins: [services.subjectTree()],
	props: {
		formData: Object,
		originName: String,
		labelWidth: {
			type: Number,
			default: 110
		}

	},
	data() {
		return {
			rules: {
				paper_name: [
					{ required: true, message: '请输入试卷名称', trigger: 'change' },
					{ required: true, validator: this.paperNameValidator, trigger: 'change' }
				],
				paper_type: [{ required: true, type: 'number', trigger: 'change' }],				
				paper_describe: [{ required: false, message: '请输入试卷描述', trigger: 'blur' }],
				subject_id: [{ required: false, type: 'array', message: '请选择关联课题', trigger: 'change' }]
			},
		};
	},
	methods: {
		handlePaperTypeChange(value) {
			this.$emit('paper-type-change', value);
		},
		getForm() {
			return this.$refs.form;
		},
		validate() {
			return this.$refs.form.validate();
		},
		getFormData() {
			return this.formData;
		},
		paperNameValidator: debounce(function (rule, value, callback) {
			if (!value) return callback();
			if (value == this.originName) return callback();
			this.$request({
				url: "_HR_TRAIN_LIBRARY_PAPER_VALID_NAME_GET",
				type: "GET",
				param: {
					paper_name: value
				},
				loading: false,
			}).then(res => {
				if (res.data.count > 0) {
					callback("该试卷名称已存在，请重新输入");
				} else {
					callback();
				}
			}).catch((res) => {
				this.$Message.error(res.msg);
				
			});
		}, 200)
		
	}
};
</script>
<style lang="scss">
.v-academy-course-paper-add-step1 {
	width:850px;
	background-color:#F5F5F6
}
</style>