<template>
	<div class="v-integration-condition-goal">
		<template v-if="id === '1'">
			业绩排名在
			{{ rules.performance_rank_from }}
			名到
			{{ rules.performance_rank_to }}
			名时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '2'">
			业绩排名在
			{{ rules.performance_rank_from }}
			名到
			{{ rules.performance_rank_to }}
			名时连续达到
			{{ rules.continue_times }}
			次及以上时，所获得的积分为
			{{ rules.point }}
			分			
		</template>
		<template v-else-if="id === '3'">
			{{ rules.performance_from }}
			≤ 业绩金额 &lt;
			{{ rules.performance_to == -1 ? '无限' : rules.performance_to }}
			元时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '4'">
			积分排名在
			{{ rules.integral_rank_from }}
			名到
			{{ rules.integral_rank_to }}
			名时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '5'">
			员工达到
			{{ rules.rank_id_name }}
			时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '6'">
			员工达到
			{{ rules.position_id_name }}
			时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '7'">
			员工达到
			{{ rules.target_type_name }}
			时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '8'">
			拥有的徒弟工龄达到
			{{ rules.apprentice_standing_month }}
			月时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '9'">
			数量为
			{{ rules.apprentice_num_from }}
			人到
			{{ rules.apprentice_num_to }}
			人时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '10'">
			员工成为
			{{ rules.position_id_name }}
			至今达到
			{{ rules.position_year }}
			年时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '11'">
			为
			{{ rules.education_name }}
			时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '12'">
			缺勤次数达到
			{{ rules.absence_time_from }}
			次到
			{{ rules.absence_time_to }}
			次时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<template v-else-if="id === '13'">
			平均积分在
			{{ rules.average_integral_from }}
			分到
			{{ rules.average_integral_to }}
			分时，所获得的积分为
			{{ rules.point }}
			分
		</template>
		<i-formitem v-else-if="id === '14'">
			基础服务项，通过手动评分进行评定
		</i-formitem>
		<i-formitem v-else-if="id === '15'">
			咨询服务项，通过手动评分进行评定
		</i-formitem>
		<i-formitem v-else-if="id === '16'">
			客户回款项，通过手动评分进行评定
		</i-formitem>
		<i-formitem v-else-if="id === '17'">
			客户满意度项，通过手动评分进行评定
		</i-formitem>
		<i-formitem v-else-if="id === '18'">
			投诉扣分项，通过手动评分进行评定
		</i-formitem>
		<i-formitem v-else-if="id === '19'">
			获得微一案师傅称号后，所获得积分为
			{{ rules.point }}
			分
		</i-formitem>
	</div>
</template>

<script>
import { FormItem, Input, Select, Option, InputNumber } from 'iview';
import OAInputNumber from '@components/hr/_common/input-number';

export default {
	name: 'hr-integration-condition-goal',
	components: {
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'oa-input-number': OAInputNumber
	},
	props: {
		id: String,
		formdata: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			rules: this.formdata
		};
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
.v-integration-condition-goal{
	.ivu-form-item {
		display: inline-block;
		vertical-align: baseline;
	}
}
</style>


