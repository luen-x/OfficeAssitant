<template>
	<div class="v-hr-academy-course-paper-add-step3">
		<i-form 
			ref="form"
			:model="formData"
			:label-width="0" 
			:show-message="false"
			inline
		>
			<table width="100%" border="1" cellspacing="0">
				<tr style="height:40px;font-size:15px">
					<th>题型</th>
					<th>单选题</th>
					<th>多选题</th>
					<th>判断题</th>
					<th>填空题</th>
					<th>问答题</th>
				</tr>
				<tr style="height:40px" align="center">
					<td>题数</td>
					<td>{{ questionStatic['1'].num }}道</td>
					<td>{{ questionStatic['2'].num }}道</td>
					<td>{{ questionStatic['3'].num }}道</td>
					<td>{{ questionStatic['4'].num }}道</td>
					<td>{{ questionStatic['5'].num }}道</td>
				</tr>
				<tr style="height:40px" align="center">
					<td>分数</td>
					<td>{{ questionStatic['1'].score }}分</td>
					<td>{{ questionStatic['2'].score }}分</td>
					<td>{{ questionStatic['3'].score }}分</td>
					<td>{{ questionStatic['4'].score }}分</td>
					<td>{{ questionStatic['5'].score }}分</td>
				</tr>
				<tr style="height:60px">
					<td align="center">合计</td>
					<td align="right" class="g-pd-r-30" colspan="5">
						<div style="margin-bottom: -30px">
							<span class="g-m-r-20 g-c-black2">
								卷面总计: 
								<span class="g-c-red-mid" style="font-weight: bold;">
									{{ questionStatic.allScore }} 分
								</span>
							</span>
							<span class="g-c-black2">及格分：
								<span v-if="disabled" class="g-c-red-mid" style="font-weight: bold;">{{ formData.pass_score }}</span>
								<i-form-item 
									v-else
									:rules="{ required: true, type: 'number' }" 
									prop="pass_score"
									label=""
									style="margin-top: -5px">
									<i-input-number
										v-model="formData.pass_score" 
										:max="questionStatic.allScore" 
										class="_input" 
										style="width:60px;position: relative;top: -2px;"
									/> 
								</i-form-item>
								分
							</span>
						</div>
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
		'i-form-item': FormItem
	},
	props: {
		questions: {
			type: Array,
			default: () => []
		},
		questionStatic: Object,
		value: Number,
		disabled: Boolean
	},
	data() {
		return {
			formData: {
				pass_score: this.value,
			}
		};
	},
	computed: {
		
	},
	watch: { 
		'formData.pass_score': function (val) {
			this.$emit('input', val);
		},
		value(val) {
			this.formData.pass_score = val;
		}
	},
	methods: {
	}
};
</script>
<style lang="scss">
.v-hr-academy-course-paper-add-step3 {
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
			font-size: 14px;
		}
	}
	.ivu-input-number {
		.ivu-input-number-handler-wrap {
			display: none;
		}
	}

}

</style>