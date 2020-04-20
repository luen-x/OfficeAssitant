<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="设置分值"
		width="680" 
		class="v-hr-academy-course-set-score "
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="0"
			class="g-pd-l-20" 
		>
			<table width="100%" border="1" cellspacing="0">
				<tr style="height:40px;font-size:15px">
					<th>题型</th>

					<th v-for="que in formData.questions" :key="que.type">{{ que.name }}</th>
				</tr>
				<tr style="height:40px" align="center">
					<td>已选题数</td>
					<td v-for="que in formData.questions" :key="que.type">{{ que.question_id.length }}道</td>
				</tr>
				<tr style="height:40px" align="center">
					<td>每题分值</td>
					<td v-for="(que,index) in formData.questions" :key="que.type" class="g-pd-t-20">
						<i-form-item :prop="'questions.'+index+'.score'" :rules="rules.score" label="">
							<i-input-number
								v-model="que.score"
								:min="1"
								:max="99"
								:precision="0"
								:active-change="false"
								:disabled="que.question_id.length==0" 
								placeholder="分值" 
								style="width: 40px"
							/>
							分
						</i-form-item>
					</td>
				</tr>
			</table>
			
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, InputNumber, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import { callbackify } from 'util';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		questions: Array, // customer_id
		type: [Number, String], // 1 题库  2 题目审核
		paperId: Number, // 设置试卷下的题目的分值时必传
	},
	data() {
		const questions = [
			{ question_id: [], name: '单选题', type: 1, score: null },
			{ question_id: [], name: '多选题', type: 2, score: null },
			{ question_id: [], name: '判断题', type: 3, score: null },
			{ question_id: [], name: '填空题', type: 4, score: null },
			{ question_id: [], name: '简答题', type: 5, score: null }
		];
		this.questions.forEach(que => {
			questions[+que.type - 1].question_id.push(que.question_id);
		});
		return { 
			visible: false,
			formData: {
				questions
			},
			rules: {
				score: [{ trigger: 'blur', validator: this.validateScore }],
			}
		};
	},
	created() {
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
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: this.paperId 
							? '_HR_ACADEMY_COURSE_PAPER_QUESTION_SCORE_POST'
							: '_HR_ACADEMY_COURSE_QUESTION_SETSCORE_POST',
						type: "POST",
						param: {
							type: this.type,
							question: this.formData.questions.filter(it => it.question_id.length > 0),
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
		validateScore(rule, value, callback) {
			const index = +rule.field.split('.')[1];
			if (this.formData.questions[index].question_id.length == 0) {

				callback();
			} else if (value === null || value === undefined) {
				callback('请输入');
			} else {
				callback();
			}

		},
		
	}
};
export const SetScore = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-academy-course-set-score {
	table,table tr th, table tr td { 
		border:1px solid #D9DCE0; 
		border-collapse: collapse;
		font-size: 14px;
	}
	table tr th {
		background-color: #F0F4FC
	}
	._input {
		input {
			font-size: 14px
		}
	}
	.ivu-input-number {
		.ivu-input-number-handler-wrap {
			display: none;
		}
	}
	.ivu-form {
		.ivu-form-item {
			display: inline-block;
		}
		.ivu-form-item-label{
			display: none;
		}

	} 
}
</style>