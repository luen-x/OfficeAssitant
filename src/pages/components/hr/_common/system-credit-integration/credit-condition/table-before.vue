<template>
	<div class="v-integration-condition-before">
		<span v-if="id === '6'">
			<span>在{{ rules.evaluate_month_name }}内</span>
			<span>评定基准期</span>
			<span>{{ rules.start_month_name }}</span>	
		</span>
		<span v-else-if="id === '9'">每年1-7月，8-12月为周期进行学分评定{{ rules.range_name }}内</span>
		<span v-else>无</span>
	</div>
</template>

<script>
import { FormItem, Input, Select, Option, DatePicker } from 'iview';

export default {
	name: 'hr-integration-condition-before',
	components: {
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
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
	watch: {
		formdata(val) {
			this.rules = val;
		}
	}
};
</script>

<style lang="scss" scoped>
.v-integration-condition-before{
	.ivu-form-item {
		display: inline-block;
		vertical-align: baseline;
	}
}
</style>


