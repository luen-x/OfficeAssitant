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
			<i-form-item label="人才梯队:" prop="echelon">
				<oa-tree-select-check 
					ref="treeSelectCheck"
					v-model="formData.echelon" 
					:data="stageTree" 
					placeholder="请选择人才梯队"
					style="position:relative;left:-10px" 
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { dataValidity, getParseUrl, getHashUrl, formatDate, getItem, initTreeData } from '@utils/utils';
import { selectCourse, services, staffByMutiTerm } from '@stores/services/hr';
import TreeSelectCheck from '@components/_common/tree-select-check/tree-select-check';

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
		'oa-tree-select-check': TreeSelectCheck,
	},
	mixins: [
		staffByMutiTerm,
		services.stageTree()
	],
	props: {
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
			formData: {
				echelon: [],
			},
			ruleValidate: {
				echelon: [
					{ required: true, type: 'array', message: '请选择人才梯队', trigger: 'change' }
				],
			},
		};
	},
	created() {

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		getEchelon() {
			const result = [];
			const tags = this.$refs.treeSelectCheck.checkedTags.filter(i => i.parent_id);
			tags.forEach(tag => {
				const exist = result.find(it => it.echelon_id == tag.parent_id);
				if (exist) {
					exist.stage_id.push(+tag.value.split('-')[1]);
				} else {
					result.push({ echelon_id: tag.parent_id, stage_id: [+tag.value.split('-')[1]] });

				}
			});
			return result;
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSubmit() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.$emit('sure', this.getEchelon());
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
export const ModalProject = CreatePortal({}, module.exports.default);
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

