<template>
	<div @click="onHeaderClick">
		<div v-for="(item,index) in selectedMultiple" :key="index" class="ivu-tag ivu-tag-checked">
			<span class="ivu-tag-text">{{ item.label }}</span>
			<Icon type="ios-close" @click.native.stop="removeTag(item)"/>
		</div>
		<span
			v-show="singleDisplayValue"
			:class="singleDisplayClasses"
		>{{ singleDisplayValue }}</span>
		<input
			v-if="filterable"
			ref="input"
			:id="inputElementId"
			v-model="query"
			:disabled="disabled"
			:class="[prefixCls + '-input']"
			:placeholder="showPlaceholder ? localePlaceholder : ''"
			:style="inputStyle"
			autocomplete="off"
			spellcheck="false"
			type="text" 
			@input="resetInputState"
			@keydown.delete="handleInputDelete"
			@focus="onInputFocus"

			@blur="onInputBlur">
		<Icon v-if="resetSelect" :class="[prefixCls + '-arrow']" type="ios-close-circle" @click.native.stop="onClear"/>
		<Icon v-if="!resetSelect && !remote && !disabled" :class="[prefixCls + '-arrow']" type="ios-arrow-down"/>
	</div>
</template>
<script>
import Icon from 'iview/src/components/icon';
import Emitter from 'iview/src/mixins/emitter';
import Locale from 'iview/src/mixins/locale';

const prefixCls = 'ivu-select';

export default {
	name: 'i-select-head',
	components: { Icon },
	mixins: [Emitter, Locale],
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		filterable: {
			type: Boolean,
			default: false
		},
		multiple: {
			type: Boolean,
			default: false
		},
		remote: {
			type: Boolean,
			default: false
		},
		initialLabel: {
			type: [String, Number, Array],
		},
		values: {
			type: Array,
			default: () => []
		},
		clearable: {
			type: [Function, Boolean],
			default: false,
		},
		inputElementId: {
			type: String
		},
		placeholder: {
			type: String
		},
		queryProp: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			prefixCls,
			query: '',
			inputLength: 20,
			remoteInitialLabel: this.initialLabel,
			preventRemoteCall: false,
		};
	},
	computed: {
		singleDisplayClasses() {
			const { filterable, multiple, showPlaceholder } = this;
			return [{
				[prefixCls + '-placeholder']: showPlaceholder && !filterable,
				[prefixCls + '-selected-value']: !showPlaceholder && !multiple && !filterable,
			}];
		},
		singleDisplayValue() {
			if ((this.multiple && this.values.length > 0) || this.filterable) return '';
			return `${this.selectedSingle}` || this.localePlaceholder;
		},
		showPlaceholder() {
			let status = false;
			if (!this.multiple) {
				const value = this.values[0];
				if (typeof value === 'undefined' || String(value).trim() === '') {
					status = !this.remoteInitialLabel;
				}
			} else if (!this.values.length > 0) {
				status = true;
			}
			return status;
		},
		resetSelect() {
			return !this.showPlaceholder && this.clearable;
		},
		inputStyle() {
			let style = {};

			if (this.multiple) {
				if (this.showPlaceholder) {
					style.width = '100%';
				} else {
					style.width = `${this.inputLength}px`;
				}
			}

			return style;
		},
		localePlaceholder() {
			if (this.placeholder === undefined) {
				return this.t('i.select.placeholder');
			} else {
				return this.placeholder;
			}
		},
		selectedSingle() {
			const selected = this.values[0];
			return selected ? selected.label : (this.remoteInitialLabel || '');
		},
		selectedMultiple() {
			return this.multiple ? this.values : [];
		}
	},
	watch: {
		values([value]) {
			if (!this.filterable) return;
			this.preventRemoteCall = true;
			if (this.multiple) {
				this.query = '';
				this.preventRemoteCall = false; // this should be after the query change setter above
				return;
			}
			// #982
			if (typeof value === 'undefined' || value === '' || value === null) this.query = '';
			else this.query = value.label;
			this.$nextTick(() => this.preventRemoteCall = false); // this should be after the query change setter above
		},
		query(val) {
			if (this.preventRemoteCall) {
				this.preventRemoteCall = false;
				return;
			}

			this.$emit('on-query-change', val);
		},
		queryProp(query) {
			if (query !== this.query) this.query = query;
		},
	},
	methods: {
		onInputFocus() {
			this.$emit('on-input-focus');
		},
		onInputBlur() {
			if (!this.values.length) this.query = ''; // #5155
			this.$emit('on-input-blur');
		},
		removeTag(value) {
			if (this.disabled) return false;
			this.dispatch('i-select', 'on-select-selected', value);
		},
		resetInputState() {
			const length = this.$refs.input.value.length * 12 + 20;
			if (this.$el.clientWidth > length) {
				this.inputLength = this.$refs.input.value.length * 12 + 20;
			} else {
				this.inputLength = this.$el.clientWidth;
			}
			//  this.$emit('on-keydown');
		},
		handleInputDelete() {
			if (this.multiple && this.selectedMultiple.length && this.query === '') {
				this.removeTag(this.selectedMultiple[this.selectedMultiple.length - 1]);
			}
		},
		onHeaderClick(e) {
			if (this.filterable && e.target === this.$el) {
				this.$refs.input.focus();
			}
		},
		onClear() {
			this.$emit('on-clear');
		}
	},
};
</script>
