<template>
	<div class="c-question-preview">
		<div v-if="relate" class="g-fs-14 g-c-black2 g-nobreak">
			<span class="_title-bar"/> 
			<span >关联课题：{{ formData.subject_name ||'--' }} </span>
			<span class="g-m-l-30">分值：{{ formData.score }} 分</span>
			<span v-if="formData.type==4 " class="g-m-l-10">每空：{{ Number((formData.score/formData.options.length).toFixed(2)) }} 分</span>
		</div>
		<div :style="relate ? 'margin-left:8px' : 'margin-left:30px'" class="g-flex g-m-t-10">
			<span class="g-c-red-mid g-fs-14" style="width:70px">【{{ typeName[formData.type] }}】</span>
			<oa-fill-preview 
				v-if="formData.type==4" 
				:title="formData.title" 
				:options="formData.options" 
				style="width:700px" 
				class="g-fs-14 g-c-black1"
			/>
			<span v-else :style="{width:width+'px'}" class="g-fs-14 g-c-black2 g-nobreak">{{ formData.title }}</span>
			<span v-if="!relate && paperType == 1">分值：{{ formData.score }} 分</span>
		</div>
		<i-radio-group v-if="formData.type==1 || formData.type==3" v-model="answer" :style="!relate ? 'margin-left: 85px;' : 'margin-left: 36px;'">
			<div v-for="(option,index) in formData.options" :key="index" class="g-m-t-10">
				<i-radio :label="option.value" disabled class="g-m-l-15" >
					<div 
						:style="'width:'+(width-15)+'px;cursor:text'" 
						class="g-dp-ib g-fs-14 g-c-black2 g-nobreak" 
						style="margin-left:10px !important;" 
					>
						<div class="g-flex">
							<span class="g-tr g-dp-ib g-tr" style="width:26px;"> {{ en[index] }}：</span>
							<span class="g-col g-nobreak">
								{{ option.label }}
								<span v-if="option.value ===formData.value" class="g-c-orange-mid g-m-l-10">(答案)</span>
							</span>
						</div>
					</div>
				</i-radio>
			</div>
		</i-radio-group>
		<i-checkbox-group v-else-if="formData.type==2" v-model="answers" :style="!relate ? 'margin-left: 85px;' : 'margin-left: 36px;'">
			<div v-for="(option,index) in formData.options" :key="index" class="g-m-t-10">
				<i-checkbox :label="option.value" disabled class="g-m-l-15" >
					<div :style="'width:'+(width-15)+'px;cursor:text'" class="g-dp-ib g-c-black2 g-fs-14" style="margin-left:10px !important;" >
						<div class="g-flex">
							<span class="g-tr g-dp-ib g-tr" style="width:26px;"> {{ en[index] }}：</span>
							<span class="g-col g-nobreak">
								{{ option.label }}
								<span v-if="formData.value.includes(option.value)" class="g-c-orange-mid g-m-l-10">(答案)</span>
							</span>
						</div>
					</div>

				</i-checkbox>
			</div>
		</i-checkbox-group>
		<div v-else-if="formData.type==5" :style="!relate ? 'margin-left: 100px;' : 'margin-left: 76px;'" class="g-m-t-10">
			<oa-limit-words
				v-model="answer" 
				:max="500" 
				width="520px"
				class="g-dp-ib"
				placeholder="请输入答案"
				disabled
			/>
		</div>
		<template v-if="!noTip">
			<div 
				v-if="relate" 
				style="height:1px;background: #e1e3e5;margin:20px 0"/>
			<div :style="!relate ? 'margin-left: 82px;' : ''">
				<div v-if="formData.keyword" class="g-fs-14 g-c-black2 g-m-t-10 ">
					<span class="_title-bar"/> 关键字：{{ formData.keyword }}
				</div>
				<div v-if="formData.maker_staff_name" class="g-fs-14 g-c-black2 g-m-t-10">
					<span class="_title-bar"/> 出题人：{{ formData.maker_staff_name }}
				</div>
				<div v-if="formData.success_tips || formData.error_tips || formData.explain" class="g-fs-14 g-c-black2 g-m-t-10">
					<span class="_title-bar"/> 评语与解析：
				</div>
				<div class="g-fs-14 g-c-black2 " style="margin-left: 18px;">
					<div v-if="formData.success_tips" class="g-m-t-10 g-flex">
						正确点评：
						<span class="g-col">{{ formData.success_tips }}</span>
					</div>
					<div v-if="formData.error_tips" class="g-m-t-10 g-flex">
						错误点评：
						<span class="g-col">{{ formData.error_tips }}</span>
					</div>
					<div v-if="formData.explain" class="g-m-t-10 g-flex">
						题目解析：
						<span class="g-col g-nobreak">{{ formData.explain }}</span>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
<script >
import { Input, Radio, RadioGroup, Checkbox, CheckboxGroup } from 'iview';
import FillPreview from './fill-preview';
import formatData from './formatData';


export default {
	name: "c-question-preview",
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
				question_id: '',
				type: 1, // 1 单选  2 多选  3 判断  4 填空  5 简答
				subject_id: '1', // 关联课题
				subject_name: '课题name',
				title: '我是题目___我是题目我是___题目我是题目我是___题目我是题目___我是题目',
				score: 10,
				single_score: 2,
				explain: '解析解析解析解析解析解析',
				keyword: 'AA BB',
				maker: 1,
				maker_staff_id: 1,
				maker_staff_name: 'Lawrence',
				success_tips: '正确提示',
				error_tips: '错误提示',
				option: [
					{
						option_name: "4万/款、5.9万/款",
						is_answer: "1",
						sort: 1
					},
					{
						option_name: "5万/款、6.9万/款",
						is_answer: "0",
						sort: 2
					}
				],
		 })
		},
		noTip: Boolean,
		width: {
			type: Number,
			default: 700
		},
		relate: {
			type: Boolean,
			default: true
		}, // 是否展示关联课题
		paperType: {
			type: Number,
			default: 1,
		}, // 试卷类型 1 固定 2 随机
	},
	data() {
		return {
			formData: {},
			typeName: {
				1: '单选题',
				2: '多选题',
				3: '判断题', 
				4: '填空题', 
				5: '问答题'
			},
			answer: '',
			answers: [],
			en: ['A', 'B', 'C', 'D', "E", 'F', "G", "H", "I", "J"],
		};
	},
	watch: {
		data: {
			handler() {
				this.formData = this.formatFormData();
				this.answer = this.formData.value;
				this.answers = this.formData.value;
			},
			deep: true,
			immediate: true
		} 
	},
	created() {
	},
	methods: {
	}
};
</script>
<style lang="scss">
.c-question-preview{
	._title-bar {
		display: inline-block;
		width:2px;
		height:14px;
		position: relative;
		top: 1px;
		background-color: #E84C57;
		margin-right: 10px;
	}
	.ivu-radio-wrapper:first-child {
		margin-right: 10px;
	}
	.ivu-radio-wrapper {
		white-space: inherit;
		word-wrap: break-word;
		word-break: break-all;
	}
	.ivu-checkbox-disabled + span {
		color: #333;
		cursor: text;
	}


}

</style>