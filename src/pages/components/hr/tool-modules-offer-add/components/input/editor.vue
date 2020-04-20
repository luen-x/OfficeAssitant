!<template>
	<i-form
		:label-width="100"
	>
		<i-form-item label="内容：">
			<i-input 
				:value="value"
				:rows="4"
				type="textarea"
				style="width: 220px;"
				placeholder="请输入内容"
				@input="handleChange(arguments[0], 'value')"
			/>
		</i-form-item>
		
		<oa-operation-panel
			:x="x" 
			:y="y" 
			:z="z" 
			:w="w" 
			:h="h" 
			:r="r" 
			@change="handleChange"
		/>
	</i-form>
</template>

<script>
import { Form, FormItem, InputNumber, Input } from 'iview';
import { ImgsPicker } from 'wya-vc';
import OperationPanel from '../../common/operation-panel';

export default {
	name: 'vm-input-editor',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
		'i-input': Input,
		'oa-operation-panel': OperationPanel
	},
	props: {
		x: Number,
		y: Number,
		z: Number,
		w: Number,
		h: Number,
		r: Number,
		value: String
	},
	data() {
		return {
		};
	},
	computed: {
	},
	created() {
	},
	methods: {
		handleChange(value, key) {
			this.$emit('change', { [key]: value });
		},
	},
};
</script>

<style lang="scss" scoped>
</style>