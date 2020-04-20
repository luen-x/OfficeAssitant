<template>
	<div v-if="disabled" class="v-administration-matter-sea-form-item g-flex">
		<div class="_label">{{ label }}</div>
		<div class="_content">
			<template v-if="!custom">
				{{ value ? value : '--' }}
			</template>
			<slot v-else/>
		</div>
	</div>
	<i-form-item
		v-else
		:label="label + ':'"
		:prop="prop">
		<slot />
	</i-form-item>
</template>

<script>
import { Form, FormItem } from 'iview';

export default {
	name: 'administration-matter-sea-form-item',
	components: {
		'i-form-item': FormItem
	},
	props: {
		disabled: Boolean,
		custom: Boolean,
		value: String | Number,
		label: String,
		prop: String,
		// rules
	}
};
</script>

<style lang="scss" scoped>
.v-administration-matter-sea-form-item {
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


