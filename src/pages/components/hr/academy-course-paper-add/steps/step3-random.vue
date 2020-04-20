<template>
	<div class="v-hr-academy-course-paper-add-step3-r">
		<i-form 
			ref="form"
			:model="formData"
			:rules="rules" 
			:label-width="0" 
			:show-message="false"
			inline
		>
			<table width="100%" border="1" cellspacing="0">
				<tr style="height:40px;font-size:15px">
					<th class="__left-title">题型</th>
					<th v-for="que in formData.numAndScore" :key="que.type" style="">
						{{ que.type_name }}<span class="g-c-black5">（共{{ que.max_num }}道）</span>
					</th>
				</tr>
				<tr style="height:40px" align="center">
					<td class="__left-title">题数</td>
					<td v-for="(que,index) in formData.numAndScore" :key="que.type">
						<i-form-item 
							:prop="'numAndScore.'+index+'.num'" 
							:rules="{ required: que.max_num > 0, type: 'number', max: que.max_num }"
							label="">
							<i-input-number
								v-model="que.num" 
								:max="que.max_num" 
								:min="0"
								:precision="0"
								:disabled="que.max_num <= 0"
								class="_input" 
								style="width: 60px"
							/> 
							≤{{ que.max_num }}道
						</i-form-item>
					</td>
				</tr>
				<tr style="height:40px" align="center">
					<td class="__left-title">分数</td>
					<td v-for="(que,index) in formData.numAndScore" :key="que.type">
						<i-form-item 
							:prop="'numAndScore.'+index+'.score'" 
							:rules="{ required: que.max_num > 0, type: 'number' }"
							label="">

							<i-input-number
								v-model="que.score" 
								:max="99" 
								:min="0"
								:precision="0"
								:disabled="que.max_num <= 0"
								class="_input" 
								style="width: 60px"
							/> 
							分/题
						</i-form-item>
					</td>
				</tr>
				<tr style="height:80px">
					<td align="center" class="__left-title">合计</td>
					<td align="right" class="g-pd-r-30" colspan="5" style="line-height: 80px">
						<span class=" g-m-r-20 g-c-black2">卷面总计：<span class="g-c-red-mid" style="font-weight: bold;">{{ allScore }} 分</span></span>
						<span>及格分：
							<span v-if="disabled" class="g-c-red-mid" style="font-weight: bold;">{{ formData.passScore }}</span>
							<i-form-item 
								v-else 
								:rules="{required: true, type: 'number', max: allScore }" 
								prop="passScore"
								label="" 
								style="margin-top: 25px" 
								class="g-c-black2">
								<i-input-number
									v-model="formData.passScore" 
									:max="allScore" 
									class="_input" 
									style="width: 60px;"
									@on-change="handleScoreChange"
								/> 
								分
							</i-form-item>
						</span>
					</td>
				</tr>
			</table>
		</i-form>
	</div>
</template>
<script>
import { InputNumber, Button, Form, FormItem } from 'iview';

export default {
	name: 'oa-add-paper-step3',
	components: {
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
	},
	props: {
		questions: {
			type: Array,
			default: () => []
		},
		numAndScore: {
			type: Array,
			default: () => [
				{ type: 1, type_name: '单选题', max_num: 0, num: null, score: null },
				{ type: 2, type_name: '多选题', max_num: 0, num: null, score: null },
				{ type: 3, type_name: '判断题', max_num: 0, num: null, score: null },
				{ type: 4, type_name: '填空题', max_num: 0, num: null, score: null },
				{ type: 5, type_name: '简答题', max_num: 0, num: null, score: null }
			]
		},
		value: {
			type: Number,
			default: null
		},
		disabled: Boolean
	},
	data() {
		return {
			formData: {
				numAndScore: this.numAndScore,
				passScore: this.value,
			},
			rules: {
				// passScore: [
				// 	{ required: true, type: 'number' }
				// ]
			}
		};
	},
	computed: {
		allScore() {
			return this.formData.numAndScore.reduce((init, queType) => {
				return init += (queType.num * queType.score) || 0;
			}, 0);
		}	
	},

	watch: {
		questions() {
			this.updateMaxNum();
		},
		numAndScore(value) {
			this.formData.numAndScore = value;
			this.updateMaxNum();
		},
		value(newVal) {
			this.formData.passScore = newVal;
		}
	},
	created() {
		this.updateMaxNum();
	},
	methods: {
		updateMaxNum(ques) {
			const numAndScore = this.formData.numAndScore;
			this.formData.numAndScore.forEach(que => {
				que.max_num = 0;
			});
			this.questions.forEach(que => {
				numAndScore[que.type - 1].max_num = (numAndScore[que.type - 1].max_num || 0) + 1;
			});
			this.formData.numAndScore = [...numAndScore];
		},

		handleScoreChange(value) {
			this.$emit('input', value);
		}
	}
};
</script>
<style lang="scss">
.v-hr-academy-course-paper-add-step3-r {
	table,table tr th, table tr td { 
		border:1px solid #D9DCE0; 
		border-collapse: collapse;
		font-size: 14px;
	}
	td {
		padding-top: 10px;
	}
	table tr th {
		background-color: #F0F4FC
	}
	tr {
		width: 200px;
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
	.ivu-form-item {
		margin-bottom: 10px!important
	}
	.__left-title {
		text-align: left!important;
		padding-left: 20px;
	}

}

</style>