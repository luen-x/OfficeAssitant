<template>
	<div class="c-result-answer-question">
		<div v-if="data.type == 1 || data.type == 3">
			<div style="margin-bottom: -5px;">
				<span class="g-c-black1">{{ index }}.</span>
				<span class="g-c-red-light g-pd-r-15">【{{ data.type_name }}】</span>
				<span class="g-c-black3 __line-height">
					{{ data.title.replace(data.type == 1 ? '【单选】' : '【判断题】', '') }}
				</span>
				<span class="_result">{{ handleSelectAnswer() }}</span>
				<span class="g-c-black5">（{{ data.score }}分）</span>
			</div>
			<div style="margin-bottom: -10px">
				<i-radio-group v-model="data.question_answer[0]">
					<i-radio
						v-for="(option, i) in data.option"
						:disabled="true"
						:key="i"
						:label="+option.option_id"
						class="g-c-black3 _radio"
					>
						<span class="__line-height" style="display: flex; margin-top: -5px">
							<span>{{ OPTION[i] }}：</span>
							<span>{{ option.option_name }}</span>
						</span>
					</i-radio>
				</i-radio-group>
			</div>
		</div>

		<div v-if="data.type == 2">
			<div style="margin-bottom: -5px;">
				<span class="g-c-black1">{{ index }}.</span>
				<span class="g-c-red-light g-pd-r-15">【{{ data.type_name }}】</span>
				<span class="g-c-black3 __line-height">{{ data.title.replace('【多选】', '') }}</span>
				<span class="_result">{{ handleSelectAnswer() }}</span>
				<span class="g-c-black5">（{{ data.score }}分）</span>
			</div>
			<div>
				<i-checkbox-group v-model="data.question_answer">
					<i-checkbox
						v-for="(option, i) in data.option"
						:disabled="true"
						:key="i"
						:label="+option.option_id"
						class="g-c-black3 _radio"
					>
						<span class="__line-height" style="display: flex; margin-top: -5px">
							<span class="g-pd-l-5">{{ OPTION[i] }}：</span>
							<span>{{ option.option_name }}</span>
						</span>
					</i-checkbox>
				</i-checkbox-group>
			</div>
		</div>

		<div v-if="data.type == 4">
			<div style="margin-bottom: -5px;">
				<span class="g-c-black1">{{ index }}.</span>
				<span class="g-c-red-light">【{{ data.type_name }}】</span>
				<span class="g-c-black5">
					（每空{{ (data.score/data.question_answer.length) }}分，共{{ data.score }}分）
				</span>
			</div>
			<div class="g-m-t-15 g-m-l-15">
				<span v-for="(item, i) in fillBlankInfo" :key="i" class="__line-height">
					{{ item }}	
					<span 
						v-if="i < fillBlankInfo.length - 1"
						class="__blank">
						{{ data.question_answer[i] }}
					</span>
				</span>				
			</div>
		</div>

		<div v-if="data.type == 5">
			<div style="margin-bottom: -5px;">
				<span class="g-c-black1">{{ index }}.</span>
				<span class="g-c-red-light">【{{ data.type_name }}】</span>
				<span class="__line-height">{{ data.title.replace('【简答题】', '') }}</span>
				<span class="g-c-black5">
					（{{ data.score }}分）
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Radio, RadioGroup, Checkbox, CheckboxGroup } from 'iview';

const OPTION = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

export default {
	components: {
		'i-input': Input,
		'i-radio': Radio,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-radio-group': RadioGroup,
	},
	props: {
		data: {
			type: Object,
			required: true
		},
		index: String | Number
	},
	data() {
		return {
			OPTION
		};
	},
	computed: {
		fillBlankInfo() {
			const result = this.data.title.split('_').filter(Boolean);
			if (this.data.title.slice(-1) === '_') {
				result.push(' ');
			}
			if (this.data.title[0] === '_') {
				result.unshift(' ');
			}
			return result;
		}
	},
	created() {
	},
	methods: {
		handleSelectAnswer() {
			const result = this.data.option.reduce((init, cur, index) => {
				this.data.question_answer.includes(cur.option_id) && init.push(OPTION[index]);
				return init;
			}, []);
			return result.join('');
		}
	}
};
</script>

<style lang="scss">
.c-result-answer-question {
	.__line-height {
		line-height: 22px;
	}
	.ivu-checkbox-disabled + span {
		color: #4b4f57 !important;
	}
	.ivu-radio-inner:after {
		background-color: orange!important;
	}
	.ivu-radio-wrapper {
		white-space: unset;
	}
	.ivu-radio-checked .ivu-radio-inner,
	.ivu-checkbox-checked .ivu-checkbox-inner {
		border-color: orange!important;
	}
	.ivu-checkbox-checked .ivu-checkbox-inner {
		background-color: orange!important;

	}
	.ivu-checkbox-disabled.ivu-checkbox-checked .ivu-checkbox-inner:after,
	.ivu-checkbox-disabled.ivu-checkbox-checked .ivu-checkbox-inner:after {
		border-color: #fff!important
	}
	._result {
		display: inline-block;
		height: 32px;
		padding: 0 20px;
		margin: 0 10px;
		margin-bottom: 10px;
		line-height: 32px;
		font-weight: bold;
		background: rgba(255,255,255,1);
		border: 1px solid rgba(212, 215, 219, 1);
		border-radius: 4px;
		font-size: 14px;
	}
	._radio {
		margin: 12px 0 12px 70px;
		display: flex;
	}
	.__blank {
		display: inline-block;
		padding: 0 15px;
		color: orange;
		border-bottom: 1px solid rgba(191,191,191,1);
	}
}
</style>


