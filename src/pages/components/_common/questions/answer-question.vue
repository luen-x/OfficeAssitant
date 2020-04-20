<template>
	<div class="c-answer-question">
		<div class="g-flex g-m-t-10" style="margin-left:8px;margin-bottom:20px;">
			<span v-if="index" class="g-m-r-5 g-fs-14 g-c-black2"> {{ index }}.</span>
			<span class="g-c-red-mid g-fs-14 _question-type">【{{ typeName[formData.type] }}】</span>
			<div v-if="formData.type==4" class="g-fs-14 g-c-black2" style="width: 90%;">
				<div class="g-m-b-20">
					(每空{{ Number((formData.score/formData.options.length).toFixed(2)) }}分，共{{ formData.score }} 分）
				</div>
				<oa-fill-preview 
					v-model="answer" 
					:disabled="disabled" 
					:title="formData.title" 
					:options="formData.options" 
					class="g-fs-14 g-c-black1"
				/>
			</div>
			<span v-else class="g-fs-14 g-c-black2 g-nobreak" style="flex:1">
				{{ formData.title }}?
				<template v-if="formData.type!=4">
					<span v-if="formData.type<=3 && disabled" class="_answer-block">{{ showAnswer }}</span>
					<span class="g-m-l-10 _answer-score">({{ formData.score }}分)</span>
				</template>
			</span>
		</div>
		<i-radio-group v-if="formData.type==1 || formData.type==3" v-model="answer" style="margin-left: 80px;" >
			<div v-for="(option,index) in formData.options" :key="index" class="g-m-b-10">
				<i-radio :label="option.value" :disabled="disabled" class="g-m-l-15">
					<div :style="'cursor:text'" class="g-dp-ib g-fs-14 g-c-black2" style="margin-left:10px">
						<div class="g-flex">
							<span class="g-tr g-dp-ib g-tr" style="width:26px;"> {{ en[index] }}：</span>
							<span class="g-col g-nobreak" style="white-space:normal">
								{{ option.label }}
							</span>
						</div>
					</div>
				</i-radio>
			</div>
		</i-radio-group>
		<i-checkbox-group v-else-if="formData.type==2" v-model="answer" style="margin-left: 80px;">
			<div v-for="(option,index) in formData.options" :key="index" class="g-m-t-10">
				<i-checkbox :label="option.value" :disabled="disabled" class="g-m-l-15" style="white-space:nowrap" >
					<div :style="'cursor:text'" class="g-dp-ib g-c-black2 g-fs-14" style="margin-left:10px !important;" >
						<div class="g-flex">
							<span class="g-tr g-dp-ib g-tr" style="width:26px;"> {{ en[index] }}：</span>
							<span class="g-col g-nobreak" style="white-space:normal">
								{{ option.label }} 
							</span>
						</div>
					</div>
				</i-checkbox>
			</div>
		</i-checkbox-group>
		<div v-else-if="formData.type==5" class="g-m-t-10" style="margin-left:94px">
			<div v-if="exam && disabled" class="g-m-b-10 g-fs-14 g-c-black2">你的回答:</div>
			<oa-limit-words
				v-model="answer" 
				:max="500" 
				:disabled="disabled"
				width="520px"
				class="g-dp-ib"
				placeholder="请输入答案"	
			/>
		</div>
	</div>
</template>
<script >
import { Input, Radio, RadioGroup, Checkbox, CheckboxGroup } from 'iview';
import formatData from './formatData';
import FillPreview from './fill-preview';

export default {
	name: "c-answer-question",
	components: {
		'i-input': Input,
		'i-radio': Radio,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-radio-group': RadioGroup,
		'oa-fill-preview': FillPreview
	},
	mixins: [formatData],
	props: {
		data: {
			type: '',
			default: () => ({
				type: 1, // 1 单选  2 多选  3 判断  4 填空  5 简答
				subject_id: '1', // 关联课题
				subject_name: '课题name',
				title: '我是题目___我是题目我是___题目我是题目我是___题目我是题目___我是题目',
				score: 10,
				option: [
					{ option_name: '选项1', value: 0 }, 
					{ option_name: '选项2', value: 1 }, 
					{ option_name: '选项3', value: 2 }, 
					{ option_name: '选项4', value: 3 }
				],
				success_tips: '正确提示',
				error_tips: '错误提示',
				explain: '解析解析解析解析解析解析',
				keyword: 'AA BB',
				maker_staff_id: 1,
				maker_staff_name: "Lawrence",
				value: 1
		 })
		},
		value: [Number, String, Array], // 只有答题时传value或者用v-model，阅卷和查看试卷不传
		disabled: Boolean, // 答题时为false， 阅卷时为true,查看时为true
		index: Number,
		exam: Boolean
	},
	data() {
		const formData = this.formatFormData();
		let answer;
		// if (this.disabled) {
		if (this.exam) {
			if (this.value !== undefined) {
				if (formData.type == 1 || formData.type == 3) {
					answer = formData.options.findIndex(op => op.option_id == this.value);
				} else if (formData.type == 2) {
					answer = this.value.map(ans => formData.options.findIndex(op => op.option_id == ans));
				} else if (formData.type == 4) {
					answer = [...this.value];
				} else {
					answer = this.value[0];
				}
			}

		} else if (formData.type == 1 || formData.type == 3) { // 单选
			answer = this.value ? formData.options.findIndex(op => op.option_id == this.value[0]) : formData.value;
		} else if (formData.type == 2) { // 多选
			answer = this.value ? this.value.map(it => formData.options.findIndex(op => op.option_id == it)) : [...formData.value];
		} else if (formData.type == 4) { // 填空 固定显示正确答案
			answer = [...formData.value];
		} else { // 问答
			answer = this.value ? this.value[0] : formData.value;
		}
		// } else {
		// 	// eslint-disable-next-line no-lonely-if
		// 	if (formData.type == 2 || formData.type == 4) {
		// 		answer = [];
		// 	} else {
		// 		answer = '';
		// 	}
		// }
		return {	
			formData,
			answer,
			en: ['A', 'B', 'C', 'D', "E", 'F', "G", "H", "I", "J"],
			typeName: {
				1: '单选题',
				2: '多选题',
				3: '判断题', 
				4: '填空题', 
				5: '问答题'
			},
		};
	},
	computed: {
		showAnswer() {
			if (this.formData.type == 1 || this.formData.type == 3) {
				const index = this.formData.options.findIndex(op => {
					return op.value === this.formData.value;
				});
				if (index > -1) {
					return this.en[index];
				} else {
					return '';
				}
			} else if (this.formData.type == 2) {
				let ans = '';
				this.formData.options.forEach((item, index) => {
					if (this.formData.value.includes(item.value)) {
						ans += this.en[index];
					}
				});
				return ans;
			} else {
				return '';
			}
			
		}
	},
	watch: {
		answer(val) {
			if (this.formData.type == 1 || this.formData.type == 3) {
				this.$emit('input', this.formData.options[val].option_id);
			} else if (this.formData.type == 2) {
				this.$emit('input', val.map(it => this.formData.options[it].option_id));
			} else {
				this.$emit('input', val);
			}
			this.$emit('change', { question_id: this.formData.question_id, value: val });
		}
	},
	created() {
	},
	methods: {
	}
};
</script>
<style lang="scss">
.c-answer-question{
	width: 100%;
	margin-bottom: 20px;
	._answer-block {
		border:1px solid lightgrey;
		border-radius: 4px;
		padding: 2px 15px;
		margin-left:10px
	}
}
</style>