<template>
	<div class="g-c-black1 g-flex-ac g-fw-w g-m-b-10" style="margin-top: -10px; line-height: 50px">
		<i-form-item>条件{{ index + 1 }}：称号类型级称体系&nbsp;</i-form-item> 
		<i-form-item
			:rules="ruleValidate.need_rank_system_id"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.need_rank_system_id'"
		> 
			<i-select 
				v-model="rule.need_rank_system_id" 
				style="width: 220px" 
				clearable 
				transfer
				placeholder="请选择级称体系"
				@on-change="handleChange"
			>
				<i-option 
					v-for="(item) in systemData"
					:key="item.rank_system_id"
					:value="item.rank_system_id"
				>
					{{ item.system_name }}
				</i-option>
			</i-select>
		</i-form-item>
		<i-form-item>&nbsp; 获得 &nbsp;</i-form-item>
		<i-form-item
			:rules="ruleValidate.need_rank_id"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.need_rank_id'"
		> 
			<i-select 
				ref="rank"
				v-model="rule.need_rank_id" 
				style="width: 220px" 
				clearable 
				transfer
				placeholder="请选择级称名称"
			>
				<i-option 
					v-for="(item) in rankSelectData"
					:key="item.rank_id"
					:value="item.rank_id"
				>
					{{ item.rank_name }}
				</i-option>
			</i-select>
		</i-form-item>
		&nbsp; 
		<i-form-item
			:rules="ruleValidate.need_rank_times"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.need_rank_times'"
		>
			<i-input-number
				v-model="rule.need_rank_times" 
				:min="0" 
				:max="99" 
				:precision="0"
				style="width: 100px"
			/>
			&nbsp; 次。
		</i-form-item>
		<i-form-item
			v-if="checked"
			:rules="ruleValidate.critical_num"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.critical_num'"
		>
			<i-input-number
				v-model="rule.critical_num"
				:max="rule.need_rank_times"
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

export default {
	name: 'oa-rules-title',
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
		systemData: {
			type: Array,
			default() {
				return [];
			}
		},
		onDel: Function,
		checked: Boolean
	},
	data() {
		return {
			rankSelectData: []
		};
	},
	watch: {
		systemData(newVal, oldVal) {
			this.handleChange(this.rule.need_rank_system_id);
		}
	},
	created() {
		this.systemData.length > 0 && this.handleChange(this.rule.need_rank_system_id);
	},
	methods: {
		handleDel() {
			this.onDel && this.onDel(this.periodIndex, this.rankIndex, this.index);
		},
		handleChange(value) {
			let system = this.systemData.filter((item) => {
				return item.rank_system_id == value;
			});
			this.$refs.rank && this.$refs.rank.clearSingleSelect();
			if (!system[0]) {
				this.rankSelectData = [];
			} else {
				this.rankSelectData = system[0].children || [];
			}
		}
	}
};
</script>

