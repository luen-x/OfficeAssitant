<template>
	<div class="v-archives-employee-customer-form-item g-flex">
		<div class="_label">{{ label }}</div>
		<div class="_content">
			{{ value ? value : '--' }}
		</div>
	</div>
</template>

<script>
import { Form, FormItem } from 'iview';

export default {
	name: 'archives-employee-customer-form-item',
	components: {
		'i-form-item': FormItem
	},
	props: {
		value: String | Number,
		label: String
	}
};
</script>

<style lang="scss" scoped>
.v-archives-employee-customer-form-item {
	border-bottom: 1px solid #ebeef1;
	padding: 20px 0 6px 0;
	._label {
		// display: inline-block;
		width: 100px;
		color: #818794
	}
	._content {
		// display: inline-block;
		width: 300px;
		color: #333333;
		word-break: break-all;
	}
}
</style>


