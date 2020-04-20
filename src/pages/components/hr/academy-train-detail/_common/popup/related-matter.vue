<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="选择关联事项"
		width="400px"
		class="v-academy-train-detail-related"
		@on-ok="handleSubmit"
		@on-cancel="handleCancel"
	>
		<i-form 
			ref="formValidate" 
			:model="formValidate" 
			:rules="ruleValidate" 
			:label-width="100">
			<i-form-item 
				:key="1"
				label="关联事项：" 
				prop="relation_type">
				<i-select
					v-model="formValidate.relation_type"
					clearable
					transfer
					style="width:220px"
					class="g-m-r-5"
					placeholder="请选择关联事项"
					@on-change="handleChange"
				>
					<i-option v-if="type !== 'enroll'" :value="1">项目</i-option>
					<i-option :value="2">课程</i-option>
				</i-select>
			</i-form-item>
			<i-form-item 
				v-if="formValidate.relation_type == '1'"
				:key="2">
				<i-radio :value="true">整个项目<span class="g-c-black4">（包括未被选择的所有关联课程）</span></i-radio>
			</i-form-item>
			<i-form-item 
				v-if="formValidate.relation_type == '2'"
				:key="3"
				prop="selected"
				style="margin-top: -10px">
				<div class="__scroll" style="max-height: 350px">
					<i-checkbox-group v-model="formValidate.selected">
						<i-checkbox 
							v-for="(course, i) in courseData"
							:disabled="course.disabled"
							:key="course.course_id"
							:label="course.course_id">
							课程{{ i + 1 }}：{{ course.course_name }}
						</i-checkbox>
					</i-checkbox-group>
				</div>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { selectCourse } from '@stores/services/hr';

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
	mixins: [selectCourse],
	props: {
		type: {
			type: String, 
			// required: true,
			validator(type) {
				const types = ['vote', 'enroll', 'exam', 'draw', 'group', 'plan', 'participate', 'sign'];
				return types.includes(type);
			}
		},
		datas: {
			type: Object,
			default: () => {
				return {
					relation_type: '',
					relation_id: []
				};
			}
		}
	},
	data() {
		return {
			project_id: this.$route.query.project_id,
			visible: false,
			formValidate: {
				relation_type: +this.datas.relation_type || '',
				selected: this.datas.relation_id ? this.datas.relation_id.map((item) => Number(item)) : []
			},
			ruleValidate: {
				relation_type: [
					{ required: true, type: 'number', message: '请选择关联事项', trigger: 'change' }
				],
				selected: [
					{ required: true, type: 'array', min: 1, message: '请选择关联课程', trigger: 'change' }
				]
			}
		};
	},
	watch: {
	},
	created() {
		if (this.type === 'enroll') {
			this.formValidate.relation_type = 2;
			this.ruleValidate.selected = [
				{ required: true, type: 'array', min: 1, max: 1, message: '报名只能选择一个课程关联奥', trigger: 'change' }
			];
		}
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
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					this.$emit('sure', this.handleRelatedReturn());
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
		handleRelatedReturn() {
			let relation_course = '';
			let project_id = '';
			if (this.formValidate.relation_type) {
				relation_course = this.courseData.filter(v => this.formValidate.selected.includes(v.course_id));
			}
			return {
				relation_type: this.formValidate.relation_type,
				label: this.formValidate.relation_type == '2' ? relation_course.map(v => v.course_name).join(',')
					: '整个项目',
				relation_id: this.formValidate.relation_type == '2' ? this.formValidate.selected : [],
				project_id: this.$route.query.project_id,
				relation_course
			};
		}
	}
};
export const PModalRetatedMatter = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-train-detail-related {
	.ivu-modal-body {
			padding-top: 25px;
      max-height: 400px;
			font-size: 14px;
			overflow-x: hidden;
    }
	// .ivu-checkbox-group {
	// 	height: 85px;
  //   overflow-y: auto;
  //   overflow-x: hidden;
	// }
	.ivu-checkbox-wrapper {
		min-width: 200px !important;
	}
	.__scroll {
		overflow: hidden;
		min-width: 200px;
		&:hover {
			overflow-y: auto;
		}
	}
}	
</style>

