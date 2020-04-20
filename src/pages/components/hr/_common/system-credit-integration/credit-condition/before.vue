<template>
	<div class="v-integration-condition-before">
		<template v-if="id === '6'">
			<i-formitem prop="evaluate_month">
				在
				<i-select
					v-model="formdata.evaluate_month"
					placeholder="选择期限"
					transfer
					style="width: 220px;"
				>
					<i-option :value="1">一个月</i-option>
					<i-option :value="2">二个月</i-option>
					<i-option :value="3">三个月</i-option>
					<i-option :value="4">四个月</i-option>
					<i-option :value="5">五个月</i-option>
					<i-option :value="6">六个月</i-option>
				</i-select>
				内,
			</i-formitem>
			<span>评定基准期</span>
			<i-formitem prop="start_month">
				<i-datepicker
					v-model="formdata.start_month"
					type="month"
					transfer
					placeholder="选择开始月份"
					style="width: 220px;"
				/>
			</i-formitem>	
		</template>
		<i-formitem v-else-if="id === '9'" prop="range">
			每年1-7月，8-12月为周期进行学分评定
			<i-select
				v-model="formdata.range"
				placeholder="选择范围"
				transfer
				style="width: 220px;"
			>
				<i-option :value="4">青藤苑</i-option>
				<i-option :value="5">梧桐苑（不包括管理）</i-option>
				<i-option :value="6">二级部门管理（总监）</i-option>
				<i-option :value="7">三级部门管理（经理）</i-option>
			</i-select>
			内
		</i-formitem>
		<i-formitem v-else>
			无
		</i-formitem>
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


