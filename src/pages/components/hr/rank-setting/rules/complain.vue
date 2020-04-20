<template>
	<!-- 标杆案例条件项 -->
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
		<i-form-item>&nbsp; 客户投诉数量不超过 &nbsp;</i-form-item>
		<i-form-item
			:rules="ruleValidate.complaint_num"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.complaint_num'"
		>
			<i-input-number
				v-model="rule.complaint_num" 
				:min="0" 
				:max="99" 
				:precision="0"
				style="width: 100px"
				placeholder="输入整数"
			/>
			&nbsp; 个。
		</i-form-item>
		<i-form-item
			v-if="checked"
			:rules="ruleValidate.critical_num"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.critical_num'"
		>
			<i-input-number
				v-model="rule.critical_num"
				:max="rule.complaint_num"
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
import { timeLargeRange } from './constants';

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
			timeLargeRange
		};
	},
	methods: {
		handleDel() {
			this.onDel && this.onDel(this.periodIndex, this.rankIndex, this.index);
		}
	}
};
</script>

