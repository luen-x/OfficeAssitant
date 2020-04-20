<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		:title="title"
		class="v-academy-course-question-audit-poup-audit"
		width="680" 
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div class="g-pd-l-20">
			<template v-if="!isBatch" >
				<oa-across-table :data="auditInfo.steps" mode="other" style="margin-bottom: 65px;">
					<div slot-scope="{item,index}" :style="index==0 ?'left:-20px':'left:-30px'" class="g-m-t-5 g-relative">
						<div class="g-tc g-c-black2 g-m-t-5">{{ item.staff_name || '' }}</div>
						<div class="g-tc g-c-black2 g-m-t-5">{{ item.depart_name || '' }}</div>
						<div class="g-tc">{{ item.time || '' }}</div>
					</div>
					<span 
						slot="side" 
						slot-scope="{item}"
						:class="item.status==3 ?'g-c-red-mid':'g-c-blue-mid'"
						class="g-m-l-10"
					>
						{{ item.name }}
					</span>
				</oa-across-table>
				<oa-question-preview v-if="auditInfo.question.question_id" :width="500" :data="auditInfo.question" no-tip />
			</template>
			<i-form
				ref="form"
				:model="formData"
				:rules="rules"
				:label-width="88"
				class="g-fs-14 g-m-t-10"
			>
				<i-form-item label="审核结果:" prop="status" style="height:20px">
					<i-radio-group v-model="formData.status" >
						<i-radio :label="2" :disabled="disabled" > <font class="g-fs-14">通过</font></i-radio>
						<i-radio :label="3" :disabled="disabled" > <font class="g-fs-14" >驳回</font> </i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item 
					:rules="{ required: formData.status != 2, message: '请输入通过或者驳回原因', trigger: 'blur' }"
					label="理由:" 
					prop="audit_remark"
				>
					<oa-limit-words v-model="formData.audit_remark" :readonly="disabled" placeholder="请输入通过或者驳回原因"/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import AcrossTable from '@components/_common/across-table/across-table';
import QuestionPreview from '@components/_common/questions/question-preview';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

const typeToStatusMap = {
	1: 4,
	2: 2,
	3: 3,
	4: 2
};

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'oa-across-table': AcrossTable,
		'oa-question-preview': QuestionPreview
	},
	props: {
		questionId: [Number, String, Array],
		action: String,
		type: {
			type: String,
			default: '1'
		}
	},
	data() {
		return {
			visible: false,
			auditInfo: {
				steps: [{ status: 2, name: '员工' }, { status: typeToStatusMap[this.type], name: '三立学府' }],
				question: {
				}
			},
			formData: {
				question_id: Array.isArray(this.questionId) ? this.questionId : [this.questionId],
				staff_id: this.$global.staff.staff_id,
				status: 2,
				audit_remark: ''
			},
			rules: {
				status: [{ required: true, type: 'number', message: '请选择审核结果', trigger: 'change' }],
				// audit_remark: [{ required: true, type: 'string', message: '请输入通过或者驳回原因', trigger: 'blur' }]
				
			}
		};
	},
	computed: {
		title() {
			if (this.action == 'add') {
				return '审核';
			} else if (this.action == 'view') {
				return '查看审核';
			}
		},
		isBatch() {
			return Array.isArray(this.questionId);

		},
		disabled() {
			return this.action == 'view';
		}

	},
	created() {

		!this.isBatch && this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		loadData() {
			this.$request({
				url: "_HR_ACADEMY_COURSE_QUESTION_AUDIT_INFO_GET",
				type: "GET",
				param: {
					question_id: this.questionId,
				},
				loading: false,
			}).then(res => {
				this.auditInfo.question = res.data;
				this.formData.audit_remark = res.data.audit_remark || '';
				this.formData.status = (res.data.status == 3 ? 3 : 2);
				this.auditInfo.steps[0] = { 
					...this.auditInfo.steps[0], 
					staff_name: res.data.maker_staff_name, 
					depart_name: res.data.maker_staff_depart_name,
					time: res.data.create_time
				};
				this.auditInfo.steps[1] = { 
					...this.auditInfo.steps[1], 
					staff_name: res.data.audit_staff_name, 
					depart_name: res.data.audit_staff_depart_name || '',
					time: res.data.audit_time
				};
				this.auditInfo.steps = [...this.auditInfo.steps];

			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleSave() {
			if (this.action == 'view') return this.handleOk();
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_HR_ACADEMY_COURSE_LIBRARY_QUESTION_AUDIT_POST',
						type: "POST", 
						param: {
							...this.formData
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
	}
};
export const QuestionAudit = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-academy-course-question-audit-poup-audit {
	.ivu-form-item-label {
		font-size: 14px;
	}
	.c-across-table{
		._item{
			width: 300px;
			height:50px;
		}
		._line {
			left: 195px;
			width: 195px;
		}
	}
}


</style>