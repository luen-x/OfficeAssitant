<template>
	<div class="c-single-select">
		<i-form-item prop="title" class="_hide-required">
			<span slot="label" class="g-c-red-mid">【判断题】</span>
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
			/>
			<span class="g-m-l-10">分</span>
		</i-form-item>
		<i-radio-group v-model="formData.value" class="g-m-l-20">
			<vc-sort-list
				v-model="formData.options"
				:mask="false"
				value-key="value"
			>
				<template slot-scope="option">
					<i-form-item 
						:key="option.value" 
						:label="en[option.sortIndex || 0]+':'"
						:prop="'options.' + (option.sortIndex || 0) + '.label'"
						:rules="optionRule"
						class="_hide-required"
					>
						<i-input v-model="formData.options[option.sortIndex||0].label" style="width:300px;top: -2px;" placeholder="请输入选项" readonly/>
						<i-radio :label="option.value" class="g-m-l-15" ><span style="margin-left:10px !important" >设为答案</span></i-radio>
					</i-form-item>
				</template>
			</vc-sort-list>
		</i-radio-group>
	</div>
</template>
<script >
import { Form, FormItem, Input, InputNumber, Radio, RadioGroup } from 'iview';
import { SortList } from 'wya-vc';

export default {
	name: "c-single-select",
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'vc-sort-list': SortList
	},
	props: {
		formData: Object,
	},
	data() {
		return {
			en: ['A', 'B', 'C', 'D', "E", 'F', "G", "H", "I", "J"],
			optionRule: [{ required: true, type: 'string', message: "请输入选项", trigger: 'blur' }]
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
.c-true-or-false{
	margin-left: 20px;
}
</style>