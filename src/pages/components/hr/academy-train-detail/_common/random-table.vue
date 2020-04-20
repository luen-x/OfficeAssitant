<template>
	<div class="c-hr-random-table">
		<i-form 
			ref="form"
			:model="formData"
			:rules="rules" 
			:label-width="0" 
			:show-message="false"
			inline
		>
			<table class="_table" width="100%" border="1" cellspacing="0">
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
							:rules="{ required: true, type: 'number' }"
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
							:rules="{ required: true, type: 'number' }"
							label="">

							<i-input-number
								v-model="que.score" 
								:max="100" 
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
							<slot name="title"/>
							<slot/>
						</span>
					</td>
				</tr>
			</table>
		</i-form>
	</div>
</template>
<script>
import { InputNumber, Button, Form, FormItem } from 'iview';

const DEFAULT_SETTING = [
	{ type: 1, type_name: '单选题', max_num: 0, num: null, score: null },
	{ type: 2, type_name: '多选题', max_num: 0, num: null, score: null },
	{ type: 3, type_name: '判断题', max_num: 0, num: null, score: null },
	{ type: 4, type_name: '填空题', max_num: 0, num: null, score: null },
	{ type: 5, type_name: '简答题', max_num: 0, num: null, score: null }
];
export default {
	name: 'oa-random-table',
	components: {
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
	},
	props: {
		// 传入题目数据
		questions: {
			type: Array,
			default: () => []
		},
		numAndScore: {
			type: Array,
			default: () => DEFAULT_SETTING
		},
	},
	data() {
		return {
			formData: {
				numAndScore: this.numAndScore,
			},
			rules: {
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
		'numAndScore': function (val) {
			this.formData.numAndScore = this.numAndScore;
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
		},
	}
};
</script>

<style lang="scss" scoped>
.c-hr-random-table {
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
    ._table {
        min-width: 1000px;
        max-width: 1200px;
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

}
</style>


