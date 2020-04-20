<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="选择课程"
		width="400px"
		class="v-academy-train-arrangement-add-course-modal"
		@on-ok="handleSubmit"
		@on-cancel="handleCancel"
	>
		<i-form 
			ref="form" 
			:model="formData" 
			:rules="ruleValidate" 
			:label-width="100">
			<i-form-item label="课程名称:" prop="course">
				<i-select
					ref="course" 
					:remote-method="loadCourse"
					:loading="courseLoading"
					v-model="formData.course"
					filterable
					clearable
					transfer
					remote
					label-in-value
					class="g-m-r-5"
					placeholder="请输入课程名称搜索"
					style="display: inline-block; width: 220px;"
				>
					<i-option v-for="(option, index) in courseData" :value="option.value" :key="index">{{ option.label }}</i-option>
				</i-select>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { dataValidity, getParseUrl, getHashUrl, formatDate, getItem, initTreeData } from '@utils/utils';
import { selectCourse, services, staffByMutiTerm, searchCourseName } from '@stores/services/hr';

export default {
	name: "oa-activity-classify-add",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-radio': Radio,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
	},
	mixins: [
		searchCourseName
	],
	data() {
		return {
			project_id: this.$route.query.project_id,
			visible: false,
			formData: {
				course: '',
			},
			ruleValidate: {
				course: [
					{ required: true, type: 'number', message: '请选择课程', trigger: 'change' }
				],
			},
			course_name: '',
		};
	},
	created() {

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSubmit() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.$emit('sure', this.formData.course);
				} else {
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
				}
			});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleChange(value) {
			// this.formValidate.selected = [];
		},
	}
};
export const ModalCourse = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-train-arrangement-add-course-modal {
	.ivu-select-multiple .ivu-select-selection {
		max-height: 100px;
		overflow-y: auto;
	}
	.ivu-select-dropdown .ivu-select-dropdown-transfer .ivu-select-multiple {
		max-width: 220px;
		overflow-x: hidden;
	}
}	
</style>

