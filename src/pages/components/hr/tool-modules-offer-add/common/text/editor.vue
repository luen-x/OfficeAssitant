<template>
	<i-form
		:label-width="100"
	>
		<i-form-item label="内容：">
			<!-- <i-input 
				:data-source="value"
				@input="handleChange($event.target.value, 'value')"
			/> -->
			{{ value }}
		</i-form-item>
		
		<oa-operation-panel
			:x="x" 
			:y="y" 
			:z="z" 
			:w="w" 
			:h="h" 
			:r="r" 
			:fs="fs"
			:weight="weight"
			@change="handleChange"
		/>
	</i-form>
</template>

<script>
import { Form, FormItem, InputNumber, Input } from 'iview';
import { ImgsPicker } from 'wya-vc';
import OperationPanel from '../operation-panel';

export default {
	name: 'vm-text-editor',
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
		fs: Number,
		weight: Number,
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