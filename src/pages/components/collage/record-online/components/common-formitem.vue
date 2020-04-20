<template>
	<div>
		<i-form-item label="课程类型：" style="margin: 0px 0 10px 0!important">
			<span>{{ detailData.lecture_set_name }}</span>
		</i-form-item>

		<i-form-item 
			v-for="(item, i) in formValidate.time"
			:key="i"
			:prop="'time.' + i " 
			:rules="{ validator: validateCreatedTime, trigger: 'change', required: true, message: '请选择对接时间' }"
			:label="labelText + '：'"
		>
			<i-data-picker 
				v-model="formValidate.time[i]"
				format="yyyy-MM-dd"
				type="daterange"
				split-panels
				transfer
				separator=" 至 "
				style="width: 300px;"
				placeholder="请选择对接时间"
			/>               
			<oa-operate-item 
				:can-add="formValidate.time.length < 10"
				:can-remove="formValidate.time.length > 1"
				:handle-add="() => formValidate.time.push([null, null])"
				:handle-remove="() => formValidate.time.splice(i, 1)"
				top="2px"
				left="310px"
			/>
		</i-form-item>

		<i-form-item 
			v-if="detailData.role_type == 3" 
			label="主持天数："
			style="margin-top: -10px"
		>
			<span>{{ chargeDay }}天</span>
		</i-form-item>

		<i-form-item 
			label="是否出差："
			style="margin-top: -10px"
			prop="is_business"
		>
			<i-radio-group v-model="formValidate.is_business">
				<i-radio :label="1">是</i-radio>
				<i-radio :label="0">否</i-radio>
			</i-radio-group>
		</i-form-item>

		<i-form-item 
			v-if="formValidate.is_business"
			prop="business_day" 
			label="出差天数：" 
			style="margin: -10px 0"
		>
			<i-input-number
				v-model="formValidate.business_day" 
				:min="1"
				:precision="0"
				:max="9"
				clearable
				style="width: 300px"
				placeholder="请输入出差天数"
			/>
			<span class="g-c-black2 g-absolute __tip">天</span>
		</i-form-item>

		<i-form-item 
			label="备注："
			class="g-pd-b-30"
		>
			<oa-limit-words
				v-model="formValidate.remark" 
				:max="200" 
				width="300px"
				placeholder="请输入备注"
			/>
		</i-form-item>
		<!-- 
		<i-form-item label="记录时间：" style="margin-top: -10px" class="g-pd-b-10">
			<span>{{ formValidate.update_time }}</span>
		</i-form-item> -->
	</div>
</template>

<script>
import { FormItem, Select, Option, Input, DatePicker,
	RadioGroup, Radio, InputNumber } from 'iview';
import moment from 'moment';
import OperateItem from './operate-item';

const TEXT_ENUM = {
	'3': '主持时间',
	'5': '唱单时间',
	'6': '音控时间',
};
    

export default {
	components: {
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-data-picker': DatePicker,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-input-number': InputNumber,
		'oa-operate-item': OperateItem
	},
	props: {
		formValidate: {
			type: Object,
			required: true
		},
		detailData: {
			type: Object,
			required: true
		}
	},
	data() {
		this.validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择对接时间');
			} else {
				callback();
			}
		};
		return {};
	},
	computed: {
		chargeDay() {
			return this.formValidate.time.reduce(
				(init, cur) => {
					const [startTime, endTime] = cur;
					const diffDay = (moment(endTime).diff(moment(startTime), 'day') + 1) || 0;
					return init + diffDay;
				},
				0
			);
		},
		labelText() {
			return TEXT_ENUM[this.detailData.role_type];
		}
	},
};
</script>