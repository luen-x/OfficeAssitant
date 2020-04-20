<template>
	<div class="c-single-select">
		<i-form-item :rules="titleRule" prop="title" class="_hide-required">
			<span slot="label" class="g-c-red-mid">【填空题】</span>
			<oa-fill-preview :title="formData.title" :options="formData.options"/>
			<oa-limit-words
				ref="title"
				v-model="formData.title" 
				:max="500" 
				width="520px"
				class="g-dp-ib"
				placeholder="请输入题目"
			/>
		</i-form-item>
		
		<i-form-item :label-width="58" label="每空：" prop="single_score" class="_hide-required">
			<i-input-number 
				v-model="formData.single_score"
				:max="99"
				:min="0"
				:precision="0"   
				placeholder="分值" 
				style="width:60px;top: -2px;"
				@on-change="handleScoreChange"
			/>
			<span class="g-m-l-10">分</span>
			<span style="position:absolute;left:-46px;top:45px" class="g-c-black4">
				分值: <span class="g-m-l-20">{{ (formData.single_score||0) * formData.options.length }} 分</span>
			</span>
		</i-form-item>

		<i-button v-if="formData.options.length<10" class="g-m-r-5" style="margin-left:90px" @click="handleInsertEmpty">
			设为答案
		</i-button>
		<oa-explain 
			:width="300"
			style="transform: translateY(1px);"
			content="鼠标选中题目中的答案，然后点击设为答案即可"
			placement="right"
		/>
		<vc-sort-list
			v-model="formData.options"
			:mask="false"
			class="g-m-t-20"
			style="margin-left:45px"
			value-key="value"
		>
			<template slot-scope="option">
				<i-form-item 
					:key="option.value" 
					:label="`答案${option.sortIndex+1||1}:`"
					:prop="'options.' + (option.sortIndex || 0) + '.label'"
					:rules="optionRule"
					class="_hide-required"	
				>
					<i-input 
						v-model="formData.options[option.sortIndex||0].label" 
						:maxlength="10" 
						style="width:300px;top: -2px;"
						placeholder="请设置答案"
					/>
					<i class="icon iconfont icon-delete1 g-pointer g-m-l-10" @click="handleRemoveOption(option)"/>
				</i-form-item>
			</template>
		</vc-sort-list>
	</div>
</template>
<script >
import { Form, FormItem, Select, Option, Input, InputNumber, Radio, RadioGroup, Checkbox, CheckboxGroup, Button, Poptip } from 'iview';
import { SortList } from 'wya-vc';
import Explain from '@components/_common/explain/explain';
import FillPreview from './fill-preview';

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
		'vc-sort-list': SortList,
		'oa-fill-preview': FillPreview,
		'oa-explain': Explain

	},
	props: {
		formData: Object,
	},
	data() {
		return {
			en: ['A', 'B', 'C', 'D', "E", 'F', "G", "H", "I", "J"],
			optionRule: [{ required: true, type: 'string', message: "请设置答案", trigger: 'blur' }],
			titleRule: [
				{ required: true, type: 'string', message: "请输入题目", trigger: 'blur' },
				{ validator: this.titleValidator, trigger: 'blur' }	
			]
		};
	},
	computed: {
	},
	created() {
	},
	methods: {
		handleScoreChange(num) {
			this.formData.score = (num || 0) * this.formData.options.length;
		},
		handleRemoveOption(option) {
			// const index = this.formData.options.findIndex(item => item.value == option.value);
			// if (option.value == this.formData.value) {
			// 	this.formData.value = '';
			// }
			const index = option.sortIndex;
			if (index > -1) {
				this.formData.options.splice(index, 1);
				const line = this.findUnderline(this.formData.title)[index];
				if (!line) return;
				this.formData.title = this.formData.title.substring(0, line.start)
					+ option.label
					+ this.formData.title.substring(line.end);
			}

		},
		handleInsertEmpty() {
			const title = this.formData.title;
			const textarea = this.$refs.title.$refs['i-input'].$refs.textarea;
			let start = textarea.selectionStart;
			let end = textarea.selectionEnd;
			if (start == end) {
				this.$Message.warning('请先用鼠标选中答案');
				return;
			}
			const answer = title.substring(start, end);
			if (answer.includes('_')) {
				this.$Message.warning('答案不能包含下划线');
				return;

			}
			if (answer.length > 10) {
				this.$Message.warning('答案长度不能超过10');
				return;
			}
			if (title[start - 1] == '_' || title[end] == '_') {
				this.$Message.warning('答案两边不能有下划线');
				return;
			}

			let inserStr = '';
			for (let i = 0; i < answer.length; i++) {
				inserStr += "_";
			}

			this.formData.title = title.substring(0, start) + inserStr + title.substring(end);	
			// 找出没用过的value
			let values = [];
			this.formData.options.forEach(item => {
				values[item.value] = true;
			});
			let index = values.findIndex(item => item === undefined);
			if (index == -1) {
				index = this.formData.options.length;
			}
			const position = this.formData.title.substring(0, start).split(/_+/).length - 1;
			if (this.formData.options.length == 0) this.formData.options.push({ label: title.substring(start, end), value: index });
			else this.formData.options.splice(position, 0, { label: title.substring(start, end), value: index });
			// this.formData.options.push();
		},
		titleValidator(rule, value, callback) {
			if (value.length > 500) {
				callback('题目长度不能大于500');
			} else {
				callback();
			}
		},
		findUnderline(str = '') {
			const lines = [];
			let startIndex;
			let endIndex;
			for (let i = 0; i < str.length; i++) {
				
				if (str[i] == '_') {
					if (startIndex === undefined) {
						startIndex = i;
					}				
				} else if (startIndex !== undefined) {
					lines.push({ start: startIndex, end: i });
					startIndex = undefined;
				}
			}
			return lines;
		}
	}
};
</script>
<style lang="scss">
.c-single-select{
	margin-left: 20px;
}
</style>