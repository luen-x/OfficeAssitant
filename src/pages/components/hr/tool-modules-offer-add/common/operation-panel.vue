<template>
	<div>
		<i-form-item label="宽度：">
			<i-input-number
				:value="w"
				:max="640"
				:min="0"
				:precision="0"
				style="width: 220px;"
				placeholder="请输入宽度"
				@input="handleChange(arguments[0], 'w')"
			/>
		</i-form-item>
		<i-form-item label="高度：">
			<i-input-number
				:value="h"
				:max="900"
				:min="0"
				:precision="0"
				style="width: 220px;"
				placeholder="请输入高度"
				@input="handleChange(arguments[0], 'h')"
			/>
		</i-form-item>
		<i-form-item label="距离左侧距离：">
			<i-input-number
				:value="x"
				:max="640"
				:min="0"
				:precision="0"
				style="width: 220px;"
				placeholder="请输入距离左侧距离"
				@input="handleChange(arguments[0], 'x')"
			/>
		</i-form-item>
		<i-form-item label="距离顶部距离：">
			<i-input-number
				:value="y"
				:max="900"
				:min="0"
				:precision="0"
				style="width: 220px;"
				placeholder="请输入距离顶部距离"
				@input="handleChange(arguments[0], 'y')"
			/>
		</i-form-item>
		<i-form-item label="层级：">
			<i-input-number
				:value="z"
				:max="999"
				:min="0"
				:precision="0"
				style="width: 220px;"
				placeholder="请输入层级"
				@input="handleChange(arguments[0], 'z')"
			/>
		</i-form-item>
		<i-form-item label="旋转角度：">
			<i-input-number
				:value="r"
				:max="360"
				:min="0"
				:precision="0"
				style="width: 220px;"
				placeholder="请输入旋转角度"
				@input="handleChange(arguments[0], 'r')"
			/>
		</i-form-item>
		<i-form-item label="字体大小：">
			<i-input-number
				:value="fs"
				:max="30"
				:min="12"
				:precision="0"
				:active-change="false"
				style="width: 220px;"
				placeholder="请输入字体大小"
				@input="handleChange(arguments[0], 'fs')"
			/>
		</i-form-item>
		<i-form-item label="字体粗细：">
			<i-select
				:value="weight"
				clearable
				style="width: 220px;"
				@on-change="handleChange(arguments[0], 'weight')"
			>
				<i-option 
					v-for="item in weights" 
					:value="item.value" 
					:key="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>
		</i-form-item>
	</div>
</template>

<script>
import { Form, FormItem, InputNumber, Select, Option } from 'iview';

export default {
	name: '',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
	},
	props: {
		x: Number,
		y: Number,
		z: Number,
		w: Number,
		h: Number,
		r: Number,
		fs: {
			type: Number,
			default: 14
		},
		weight: Number
	},
	data() {
		return {
			weights: [
				{ label: '100', value: 100 },
				{ label: '200', value: 200 },
				{ label: '300', value: 300 },
				{ label: 400, value: 400 },
				{ label: '500', value: 500 },
				{ label: '600', value: 600 },
				{ label: '700', value: 700 },
				{ label: '800', value: 800 },
				{ label: '900', value: 900 }
			]
		};
	},
	methods: {
		handleChange(value, key) {
			this.$emit('change', value, key);
		},
	}
};
</script>

