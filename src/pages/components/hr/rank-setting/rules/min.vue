<template>
	<!-- 累计业绩条件项 -->
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
					v-for="(item, index) in timeRange"
					:key="index"
					:value="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>
		</i-form-item>
		<i-form-item>&nbsp; 每月业绩不低于 &nbsp;</i-form-item>
		<i-form-item
			:rules="ruleValidate.monthly_performance"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.monthly_performance'"
		>
			<i-input-number
				v-model="rule.monthly_performance" 
				:precision="2" 
				:max="99999999" 
				:min="0"
				:active-change="false" 
				style="width: 100px"
				placeholder="输入金额"
			/>
			&nbsp; 元。
		</i-form-item>
		<i-form-item
			v-if="checked"
			:rules="ruleValidate.critical_num"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.critical_num'"
		>
			<i-input-number 
				v-model="rule.critical_num"
				:max="rule.monthly_performance"
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
import { timeRange } from './constants';

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
			timeRange
		};
	},
	methods: {
		handleDel() {
			this.onDel && this.onDel(this.periodIndex, this.rankIndex, this.index);
		}
	}
};
</script>

