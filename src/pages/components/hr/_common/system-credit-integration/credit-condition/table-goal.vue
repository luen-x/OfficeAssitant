<template>
	<div class="v-integration-condition-goal">
		<template v-if="['1', '2', '3', '4', '5', '6'].some(item => item === id)">
			<span v-if="['1', '2', '5'].some(item => item === id)">本人</span>
			<span v-else>{{ rules.object_name }}</span>
			<span v-if="id === '1'">每次完成必修课学习所获得学分为</span>
			<span v-if="id === '2'">每次必修课首次考试通关时，所获得学分为</span>
			<span v-if="id === '3'">必修课开课后超过一个月,</span>
			<span v-if="id === '3'">每有一人有未通关必修课即获得</span>
			<span v-if="id === '4'">本月必修课通关时比例</span>
			<span v-if="id === '4'">{{ rules.percent_type_name }}</span>
			<span v-if="id === '4'">{{ rules.pass_percent }}</span>
			<span v-if="id === '4'">%时，所获得学分为</span>
			<span v-if="id === '5'">每次选修课凭证审核通过或者选修课通关后，所获得的学分为</span>
			<span v-if="id === '6'">未参与任何选修课课程，所获得学分为</span>
			{{ rules.point }}分
		</template>
		<template v-if="id === '7'">
			上传了
			{{ rules.material_use_name }}
			素材，并经过人事审核后
			{{ rules.material_person_type_name }}
			所获得学分为
			{{ rules.point }}
			分
		</template>
		<template v-if="id === '9'">
			学分排名在
			{{ rules.credit_rank_from }}
			名到
			{{ rules.credit_rank_to }}
			名时，所获得学分为
			{{ rules.point }}
			分
		</template>
		<template v-if="id === '10'">
			{{ rules.audit_type }}
			通过后，获取学分
			{{ rules.point }}
			分
		</template>
		<template v-if="id === '8'">
			培训开课条件项，通过手动评分进行评定
		</template>
	</div>
</template>

<script>
import { FormItem, Input, Select, Option, InputNumber } from 'iview';
import Rules from './rules';

export default {
	name: 'hr-integration-condition-goal',
	components: {
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber
	},
	mixins: [Rules],
	props: {
		id: String,
		formdata: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			rules: this.formdata,
		};
	},
	watch: {
		formdata(val) {
			this.rules = val;
		}
	},
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


