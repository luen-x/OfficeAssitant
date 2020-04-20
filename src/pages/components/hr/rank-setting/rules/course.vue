<template>
	<!-- 开设课程条件项 -->
	<div class="g-c-black1 g-flex-ac g-fw-w g-m-b-10" style="margin-top: -10px; line-height: 50px">
		<i-form-item>条件{{ index + 1 }}：从&nbsp; </i-form-item>
		<i-form-item
			:rules="ruleValidate.start_month"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.start_month'"
		> 
			<i-select 
				v-model="rule.start_month" 
				style="width: 220px" 
				clearable 
				transfer
				placeholder="请选择开始月份"
			>
				<i-option 
					v-for="(item, index) in monthData"
					:key="index"
					:value="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>
		</i-form-item>
		<i-form-item>&nbsp; 开始累计 &nbsp;</i-form-item>
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
		<i-form-item>&nbsp; 上传 &nbsp;</i-form-item>
		<i-form-item
			:rules="ruleValidate.material_type"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.material_type'"
		> 
			<i-select 
				v-model="rule.material_type" 
				style="width: 220px" 
				clearable 
				transfer
				placeholder="请选择素材用途"
			>
				<i-option 
					v-for="(item, index) in type"
					:key="index"
					:value="item.value"
				>
					{{ item.name }}
				</i-option>
			</i-select>
		</i-form-item>
		<i-form-item>&nbsp; 素材时，为 &nbsp;</i-form-item>
		<i-form-item
			:rules="ruleValidate.material_person_type"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.material_person_type'"
		> 
			<i-select 
				v-model="rule.material_person_type" 
				style="width: 220px" 
				clearable 
				transfer
				placeholder="请选择核算者"
			>
				<i-option :value="1">素材提供人</i-option>
				<i-option :value="2">主要分享人</i-option>
			</i-select>
		</i-form-item>
		<i-form-item>&nbsp; 达到 &nbsp;</i-form-item>
		<i-form-item
			:rules="ruleValidate.material_num"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.material_num'"
		>
			<i-input-number
				v-model="rule.material_num" 
				:min="0" 
				:precision="0"
				:max="99" 
				style="width: 100px"
				placeholder="输入数字"
			/>
			&nbsp; 节。
		</i-form-item>
		<i-form-item
			v-if="checked"
			:rules="ruleValidate.critical_num"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.critical_num'"
		>
			<i-input-number 
				v-model="rule.critical_num"
				:max="rule.material_num"
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
import { timeLargeRange, monthData } from './constants';

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
			monthData,
			type: []
		};
	},
	mounted() {
		this.loadType();
	},
	methods: {
		handleDel() {
			this.onDel && this.onDel(this.periodIndex, this.rankIndex, this.index);
		},
		loadType() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_SYSTEM_RANK_MARIERIAL_TYPE_GET',
				type: 'GET',
			}).then(res => {
				this.type = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
	}
};
</script>

