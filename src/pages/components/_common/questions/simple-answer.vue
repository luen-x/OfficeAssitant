<template>
	<div class="c-single-select">
		<i-form-item prop="title" class="_hide-required">
			<span slot="label" class="g-c-red-mid">【问答题】</span>
			<oa-limit-words
				v-model="formData.title" 
				:max="300" 
				width="520px"
				class="g-dp-ib"
				placeholder="请输入题目"
			/>
		</i-form-item>
		<i-form-item :label-width="58" label="分值：" prop="score" class="_hide-required">
			<i-input-number 
				v-model="formData.score"
				:max="99"
				:min="0" 
				:precision="0" 
				placeholder="分值" 
				style="width:60px;top: -2px;"
			/><span class="g-m-l-10">分</span>
		</i-form-item>
		<i-form-item :rules="valueRule" prop="value" label="答案:" class="_hide-required">
			<oa-limit-words
				v-model="formData.value" 
				:max="500" 
				width="520px"
				class="g-dp-ib"
				placeholder="请输入答案"
			/>
		</i-form-item>
		
	</div>
</template>
<script >
import { Form, FormItem, Select, Option, Input, InputNumber, Radio, RadioGroup, Checkbox, CheckboxGroup, Button, Poptip } from 'iview';
import { SortList } from 'wya-vc';

export default {
	name: "c-single-select",
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-radio': Radio,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-radio-group': RadioGroup,
		'i-button': Button,
		'i-poptip': Poptip,
		'vc-sort-list': SortList
	},
	props: {
		formData: Object,
	},
	data() {
		return {
			valueRule: [{ required: false, type: 'string', message: "请输入答案", trigger: 'blur' }]
			
		};
	},
	computed: {
	},
	created() {
	},
	methods: {
		
	}
};
</script>
<style lang="scss">
.c-single-select{
	margin-left: 20px;
}
</style>