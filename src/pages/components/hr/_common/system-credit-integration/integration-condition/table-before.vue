<template>
	<div class="v-integration-condition-before">
		<div class="g-m-b-10">
			<span>{{ rules.cycle_month_name }}</span>
			<span>内，评定基准期</span>
			<span>{{ rules.start_month_name }}</span>
		</div>
		<span v-if="id < 7 || id === '13' || id === '19'">
			<span>{{ rules.object_name }}</span>
			<span v-if="id < 3">业绩达到</span>
			<span v-if="id < 3">{{ rules.performance }}</span>
			<span v-if="id < 3">元</span>
			<span v-if="id < 3">且范围在</span>
			<span v-if="id < 3">{{ rules.range_name }}</span>
			<span v-if="id === '3' && [1,2,3].some(item => rules.object === item)">
				<span>且成为</span>
				<span>{{ rules.position_id_name }}</span>
				<span>在</span>
				<span>{{ rules.position_month }}</span>
				<span>月内</span>
			</span>
			<span v-if="id === '4'">且在</span>
			<span v-if="id === '4'">{{ rules.range_name }}</span>
			<span v-if="(id < 3 && visible) || id === '4'">内所有工龄在</span>
			<span v-if="(id < 3 && visible) || id === '4'">{{ rules.standing_from }}</span>
			<span v-if="(id < 3 && visible) || id === '4'">月到</span>
			<span v-if="(id < 3 && visible) || id === '4'">{{ rules.standing_to }}</span>
			<span v-if="(id < 3 && visible) || id === '4'">月内的员工中</span>
			<span v-if="id === '5'">针对</span>
			<span v-if="id === '5'">{{ rules.rank_system_type_name }}</span>
			<span v-if="id === '5'">级称体系</span>
			<span v-if="id === '13'">
				<span>的员工，针对</span>
				<span>{{ rules.integral_type_name }}</span>
				<span>服务积分类型所获得的积分</span>
			</span>
		</span>
		<span v-if="id > 13 && id < 19">
			整体得分上限
			<span>{{ rules.total_maximum }}</span>
			单客户得分上限
			<span>{{ rules.single_maximum }}</span>
		</span>
		<span v-if="id === '9' || id === '8'">
			<span>{{ rules.master_type_name }}</span>
			<span>的师傅</span>
			<span v-if="id === '9'">需要拥有工龄</span>
			<span v-if="id === '9'">{{ rules.standing_from }}月到</span>
			<span v-if="id === '9'">{{ rules.standing_to }}月的徒弟</span>
		</span>
		<span v-if="id === '19'">的员工</span>
		<span v-if="['7', '10', '11', '12'].some(item => item === id)">
			无
		</span>
	</div>
</template>

<script>
import { FormItem, Input, Select, Option, DatePicker, InputNumber } from 'iview';

export default {
	name: 'hr-integration-condition-before',
	components: {
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'i-datepicker': DatePicker
	},
	props: {
		id: String,
		formdata: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			rules: this.formdata
		};
	},
	computed: {
		visible() {
			return [1, 2, 3].some(item => this.formdata.object === item);
		}
	},
	watch: {
		formdata(val) {
			this.rules = val;
		}
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
.v-integration-condition-before{
	white-space: normal;

	.ivu-form-item {
		display: inline-block;
		vertical-align: baseline;
	}
}
</style>


