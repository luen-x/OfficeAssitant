<template>
	<li
		v-if="show"
		:class="classes"
		@click.stop="select"
		@mousedown.prevent
	><slot>{{ showLabel }}</slot></li>
</template>
<script>
import Emitter from 'iview/src/mixins/emitter';
import { findComponentUpward } from 'iview/src/utils/assist';

const prefixCls = 'ivu-select-item';

export default {
	name: 'i-option',
	componentName: 'select-item',
	mixins: [Emitter],
	props: {
		value: {
			type: [String, Number],
			required: true
		},
		label: {
			type: [String, Number]
		},
		disabled: {
			type: Boolean,
			default: false
		},
		// selected: {
		// 	type: Boolean,
		// 	default: false
		// },
		isFocused: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			searchLabel: '', // the slot value (textContent)
			autoComplete: false,
			selected: false,
			show: true
		};
	},
	computed: {
		classes() {
			return [
				`${prefixCls}`,
				{
					[`${prefixCls}-disabled`]: this.disabled,
					[`${prefixCls}-selected`]: this.selected && !this.autoComplete,
					[`${prefixCls}-focus`]: this.isFocused,
				}
			];
		},
		showLabel() {
			return (this.label) ? this.label : this.value;
		},
		optionLabel() {
			return (this.$el && this.$el.textContent) || this.label;
		}
	},
	mounted() {
		const Select = findComponentUpward(this, 'iSelect');
		if (Select) this.autoComplete = Select.autoComplete;
		this.$on('on-select-change', this.setSelected);
		this.$on('on-filter-query-change', this.handleQueryChange);
	},
	methods: {
		select() {
			if (this.disabled) return false;
			this.dispatch('i-select', 'on-select-selected', {
				value: this.value,
				label: this.optionLabel.trim(),
			});
			this.$emit('on-select-selected', {
				value: this.value,
				label: this.optionLabel.trim(),
			});
		},
		setSelected(...selects) {			
			if (Array.isArray(selects)) {
				if (selects[0] && selects[0].value) {
					selects = selects.map(i => i.value);
				}
				if (selects.includes(this.value)) {
					this.selected = true;
				} else {
					this.selected = false;
				}
			} else {
				this.selected = this.value === selects;
			}
		},
		handleQueryChange(query) {
			if ((this.optionLabel.trim() + '').includes(query)) {
				this.show = true;
			} else {
				this.show = false;
			}	
		}
	},
};
</script>
