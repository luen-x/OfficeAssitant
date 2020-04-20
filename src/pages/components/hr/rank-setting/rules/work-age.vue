<template>
	<!-- 工龄条件项 -->
	<div class="g-c-black1 g-flex-ac g-fw-w g-m-b-10" style="margin-top: -10px; line-height: 50px">
		<i-form-item>条件{{ index + 1 }}：员工成为&nbsp; </i-form-item>
		<i-form-item
			:rules="ruleValidate.position_id"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.position_id'"
		>
			<i-select
				v-model="rule.position_id" 
				style="width: 100px"
				placeholder="请选择职位"
			>
				<i-option
					v-for="item of positionArr"
					:key="item.position_id"
					:value="item.position_id"
				>{{ item.position_name }}</i-option>
			</i-select>
			&nbsp; 至今达到。
		</i-form-item>
		<i-form-item
			:rules="ruleValidate.standing_month"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.standing_month'"
		>
			<i-input-number
				v-model="rule.standing_month" 
				:min="0"
				:max="99" 
				:precision="0"
				style="width: 100px"
				placeholder="输入工龄"
			/>
			&nbsp; 月。
		</i-form-item>
		<i-form-item
			v-if="checked"
			:rules="ruleValidate.critical_num"
			:prop="'periods.' + periodIndex + '.ranks.' + rankIndex +'.rules.' + index + '.critical_num'"
		>
			<i-input-number 
				v-model="rule.critical_num"
				:max="rule.standing_month"
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
		const { query } = this.$route; 
		return {
			timeRange,
			query,
			positionArr: []
		};
	},
	mounted() {
		this.loadPosition();
	},
	methods: {
		handleDel() {
			this.onDel && this.onDel(this.periodIndex, this.rankIndex, this.index);
		},
		loadPosition() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_DEPART_POSITION_GET',
				type: 'GET',
				param: {
					depart_id: query.depart_id
				},
			}).then(res => {
				this.positionArr = res.data[0].positions;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
	}
};
</script>

