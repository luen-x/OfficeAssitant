<template>
	<!-- 评分比例条件项 -->
	<div class="g-c-black1 g-flex-ac g-fw-w g-m-b-10" style="margin-top: -10px; line-height: 50px">
		<i-form-item>条件{{ index + 1 }}：累计&nbsp; </i-form-item>
		<i-form-item
			:rules="ruleValidate.accumulate_month"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.accumulate_month'"
		> 
			<i-select 
				v-model="rule.accumulate_month" 
				style="width: 220px" 
				clearable 
				transfer
				placeholder="请选择时间段"
			>
				<i-option 
					v-for="(item, index) in timeLargeRange"
					:key="index"
					:value="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>
		</i-form-item>
		<i-form-item>&nbsp; 客户评分 &nbsp;</i-form-item>
		<i-form-item
			:rules="ruleValidate.client_score_type"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.client_score_type'"
		> 
			<i-select 
				v-model="rule.client_score_type" 
				style="width: 220px" 
				clearable 
				transfer
				placeholder="选择类型"
			>
				<i-option 
					v-for="(item, index) in compareData"
					:key="index"
					:value="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>
		</i-form-item>
		&nbsp; 
		<i-form-item
			:rules="ruleValidate.client_score"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.client_score'"
		>
			<i-input-number
				v-model="rule.client_score" 
				:min="0"
				:max="99" 
				:precision="2"
				:active-change="false" 
				style="width: 100px"
				placeholder="输入数字"
			/>
			&nbsp;分的比例
		</i-form-item>
		&nbsp; &nbsp;
		<i-form-item
			:rules="ruleValidate.evaluate_type"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.evaluate_type'"
		> 
			<i-select 
				v-model="rule.evaluate_type" 
				style="width: 220px" 
				clearable 
				transfer
				placeholder="选择类型"
			>
				<i-option 
					v-for="(item, index) in compareData"
					:key="index"
					:value="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>
		</i-form-item>
		&nbsp; 
		<i-form-item
			:rules="ruleValidate.evaluate_value"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.evaluate_value'"
		>
			<i-input-number
				v-model="rule.evaluate_value" 
				:min="0" 
				:max="100" 
				:precision="0"
				style="width: 100px"
				placeholder="输入整数"
			/>
			&nbsp; %。
		</i-form-item>
		<i-form-item
			v-if="checked"
			:rules="ruleValidate.critical_num"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.critical_num'"
		>
			<i-input-number 
				v-model="rule.critical_num"
				:max="rule.evaluate_value"
				:min="0"
				style="width: 100px"
				placeholder="提醒临界值"
			/>
		</i-form-item>
		<i-form-item>
			<span class="g-operation g-m-l-20" @click="handleDel">删除</span>
		</i-form-item>
	</div>
</template>

<script>
import { 
	FormItem, Input, InputNumber, Select, Option, Message
} from 'iview';
import { timeLargeRange, compareData } from './constants';

export default {
	name: 'oa-rules-min',
	components: {
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-input-number': InputNumber,
	},
	props: {
		rule: {
			type: Object,
			default() {
				return {};
			}
		},
		ruleValidate: {
			type: Object,
			default() {
				return {};
			}
		},
		periodIndex: Number,
		rankIndex: Number,
		index: Number,
		onDel: Function,
		checked: Boolean
	},
	data() {
		return {
			timeLargeRange,
			compareData
		};
	},
	methods: {
		handleDel() {
			this.onDel && this.onDel(this.periodIndex, this.rankIndex, this.index);
		}
	}
};
</script>

