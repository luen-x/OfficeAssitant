<template>
	<i-form
		:label-width="100"
	>
		<i-form-item label="图片：">
			<vc-imgs-picker 
				:data-source="value"
				:max="1"
				@change="handleChange(arguments[0], 'value')"
				@error="handleError"
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
import { Form, FormItem, InputNumber } from 'iview';
import { ImgsPicker } from 'wya-vc';
import OperationPanel from '../operation-panel';

export default {
	name: 'vm-text-editor',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
		'vc-imgs-picker': ImgsPicker,
		'oa-operation-panel': OperationPanel
	},
	props: {
		x: Number,
		y: Number,
		z: Number,
		w: Number,
		h: Number,
		r: Number,
		value: Array
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
		handleError(err) {
			this.$Message.error(err.msg);
		}
	},
};
</script>

<style lang="scss" scoped>
</style>