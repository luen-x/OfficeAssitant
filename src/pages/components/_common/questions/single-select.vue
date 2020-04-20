<template>
	<div class="c-single-select">
		<i-form-item prop="title" class="_hide-required">
			<span slot="label" class="g-c-red-mid">【单选题】</span>
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
				:draggable="canDrag"
				value-key="value"
			>
				<template slot-scope="option">
					<i-form-item 
						:key="option.value" 
						:label="en[option.sortIndex || 0]+ ':'"
						:prop="'options.' + (option.sortIndex || 0) + '.label'"
						:rules="optionRule"
						class="_hide-required"
					>
						<i-input 
							v-model="formData.options[option.sortIndex||0].label" 
							:maxlength="255"
							style="width:300px;top: -2px;"
							placeholder="请输入选项"
							@on-focus="canDrag=false;"
							@on-blur="canDrag = true;"
						/>
						<i-radio :label="option.value" class="g-m-l-15" ><span style="margin-left:10px !important" >设为答案</span></i-radio>
						<i 
							v-if="formData.options.length>2" 
							class="icon iconfont icon-delete1 g-pointer g-c-black5" 
							@click="handleRemoveOption(option)"
						/>
					</i-form-item>
				</template>
			</vc-sort-list>
		</i-radio-group>
		<i-button 
			v-if=" formData.options.length<10" 
			class="_add-option g-c-blue-light" 
			type="dashed" 
			@click="handleAddOption"
		>+ 添加选项</i-button>
		<span v-if="formData.options.length<10" style="width:100px" class="g-c-black5 g-m-l-20 g-dp-ib" >可以拖拽移动位置</span>

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
			en: ['A', 'B', 'C', 'D', "E", 'F', "G", "H", "I", "J"],
			optionRule: [{ required: true, type: 'string', message: "请输入选项", trigger: 'blur' }],
			canDrag: true
		};
	},
	computed: {
	},
	created() {
	},
	methods: {
		handleAddOption() {
			// 找出没用过的value
			let values = [];
			this.formData.options.forEach(item => {
				values[item.value] = true;
			});
			let index = values.findIndex(item => item === undefined);
			if (index == -1) {
				index = this.formData.options.length;
			}
			this.formData.options.push({ label: '', value: index });
		},
		handleRemoveOption(option) {
			const index = this.formData.options.findIndex(item => item.value == option.value);
			if (option.value == this.formData.value) {
				this.formData.value = '';
			}
			if (index > -1) this.formData.options.splice(index, 1);

		}
	}
};
</script>
<style lang="scss">
.c-single-select{
	margin-left: 20px;
	.ivu-btn-dashed {
		border-color: #2e9dfa;
	}
}
</style>