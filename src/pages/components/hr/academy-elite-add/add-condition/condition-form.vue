<template>
	<div class="c-condition-form">
		<i-form 
			ref="form" 
			:model="formData"
			:rules="ruleFormData"
			class="_form">
			<i-form-item v-if="type === 1" :prop="'value' + type">
				<i-input-number
					v-model="formData['value1']"
					:placeholder="placeholder ? placeholder : '输入最小值（整数）'"
					v-bind="option"
					style="width: 140px"
					@on-change="handleChange"
				/>
			</i-form-item>

			<i-form-item v-if="type === 2" :prop="'value' + type">
				<i-select
					v-model="formData['value2']"
					:placeholder="placeholder ? placeholder : '选择职位'"
					v-bind="option"
					:style="{ width: width }"
					multiple
					clearable
					transfer
					style="width: 140px"
					@on-change="handleChange"
				>
					<i-option 
						v-for="position in positionList"
						:key="position.position_id"
						:value="position.position_id"
					>
						{{ position.position_name }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item v-if="type === 3" :prop="'value' + type">
				<i-select
					v-model="formData['value3']"
					:placeholder="placeholder ? placeholder : '选择时间段'"
					v-bind="option"
					style="width: 140px"
					clearable
					transfer
					@on-change="handleChange"
				>
					<i-option 
						v-for="age in 12"
						:key="age"
						:value="age"
					>
						{{ age }}个月
					</i-option>
					<i-option :value="24">2年</i-option>
					<i-option :value="36">3年</i-option>
					<i-option :value="0">不限</i-option>
				</i-select>
			</i-form-item>
		</i-form>
	</div>
</template>

<script>

import { Form, FormItem, Input, Select, Option, InputNumber } from 'iview';
import API_ROOT from "@stores/apis/root";

export default {
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		option: {
			type: Object,
			default: () => {
				return {
					min: 0,
					max: 40000000
				};
			}
		},
		placeholder: {
			type: String
		},
		type: {
			type: Number,
			required: true
		},
		value: {
			type: Array | Number | String | Object
		},
		departId: {
			type: Number | String
		},
		width: {
			type: String,
			default: '130px'
		},
		rule: {
			type: Array
		}
	},
	data() {
		return {
			formData: {
				['value' + this.type]: this.value,
			},
			ruleFormData: {
				value1: [
					{ required: true, type: 'number', message: '请输入正确的值' }
				],
				value2: [
					{ required: true, type: "array", message: '请选择职位' }
				],
				value3: [
					{ required: true, type: 'number', message: '请选择时间段' }
				]
			},
			positionList: []
		};
	},
	watch: {
		value(newVal) {
			this.formData = {
				['value' + this.type]: this.value
			};
		},
		type(newVal) {
			if (this.type === 2) {
				this.handlePositionList();
			}
		}
	},
	created() {
		if (this.type === 2) {
			this.handlePositionList();
		}
	},
	methods: {
		handlePositionList() {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then(({ data }) => {
				this.positionList = data.filter(v => v.depart_id == this.departId)[0].positions;
			}).catch((error) => {});
		},
		handleChange(v) {
			this.$emit('input', v);
		}	
	}
};
</script>

<style lang="scss">
.c-condition-form {
	.ivu-select-selection {
		max-height: 62px;
		overflow: auto;
	}
}
</style>


