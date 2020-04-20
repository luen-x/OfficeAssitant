<template>
	<div :style="{width: width}" class="g-relative c-limit-words">
		<i-input
			ref="i-input"
			v-model="remark"
			:maxlength="max"
			:placeholder="placeholder"
			:disabled="disabled"
			:rows="autosize.minRows"
			:autosize="autosize"
			:readonly="readonly"
			type="textarea"
			@input="handleInput"
		/>
		<div class="g-absolute _remain">
			{{ type === 'residual' ? remain_num : current_num }}/{{ max }}
		</div>
	</div>
</template>
<script>
import { Input } from "iview";

export default {
	name: "oa-limit-words",
	components: {
		"i-input": Input
	},
	props: {
		value: {
			type: String,
			default: ""
		},
		// row: {
		// 	type: Number,
		// 	default: 4
		// },
		max: {
			type: Number,
			default: 200
		},
		placeholder: {
			type: String,
			default: "请输入备注信息"
		},
		width: {
			type: String,
			default: "320px"
		},
		type: {
			type: String,
			validator(value) {
				return ['residual', 'current'].indexOf(value) !== -1;
			},
			default: 'current'
		},
		disabled: Boolean,
		readonly: Boolean,
		autosize: {
			type: Object,
			default: () => {
				return { minRows: 4, maxRows: 8 };
			}
		}
	},
	data() {
		return {
			remark: ''
		};
	},
	computed: {
		remain_num() {
			let currentLength = (this.remark || '').length;
			return currentLength < this.max
				? this.max - currentLength
				: 0;
		},
		current_num() {
			let currentLength = (this.remark || '').length;
			return currentLength;
		}
	},
	watch: {
		value(newValue, oldValue) {
			this.remark = newValue;
		},
	},
	mounted() {
		this.remark = this.value;
	},
	methods: {
		handleInput(value) {
			this.current = value;
			this.$emit("input", value);
			this.dispatch("FormItem", "on-form-change", value);
		}
	}
};
</script>
<style lang="scss">
.c-limit-words {
	textarea.ivu-input {
		padding-bottom: 16px !important;
		box-sizing: border-box;
		font-size: 12px !important;
	}
    ._remain {
		height: 18px;
        line-height: 18px;
		bottom: -18px;
        right: 0px;
		color: #c0c0c0;
    }
}
</style>
