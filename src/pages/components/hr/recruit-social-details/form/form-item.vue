<template>
	<div v-if="disabled" class="v-recruit-social-detail-form-item g-flex">
		<span class="_label">{{ label }}</span>
		<div class="_content">
			<template v-if="!customer">
				{{ value ? value : '--' }}
			</template>
			<slot v-else />
		</div>
	</div>
	<i-form-item
		v-else-if="!disabled && prop !== 'create_time' && prop !== 'send_offer_time'"
		:label="label + ':'"
		:prop="prop"
		:rules="rules"
	>
		<slot />
	</i-form-item>
</template>

<script>
import { Form, FormItem } from 'iview';

export default {
	name: 'recruit-social-detail-form-item',
	components: {
		'i-form-item': FormItem
	},
	props: {
		disabled: Boolean,
		customer: Boolean,
		label: String,
		prop: String,
		rules: Object | Array,
		value: String | Number
	}
};
</script>

<style lang="scss">
.v-recruit-social-detail-form-item {
	border-bottom: 1px solid #ebeef1;
	padding: 20px 0 6px 0;
	._label {
		display: inline-block;
		width: 100px;
		color: #818794
	}
	._content {
		display: inline-block;
		width: 300px;
		color: #333333;
		word-break: break-all;
	}
}
</style>


