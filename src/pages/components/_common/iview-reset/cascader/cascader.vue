<template>
	<div v-click-outside="handleClose" :class="classes">
		<div ref="reference" :class="[prefixCls + '-rel']" @click="toggleOpen">
			<input :name="name" :value="currentValue" type="hidden">
			<slot>
				<i-input
					ref="input"
					:element-id="elementId"
					:readonly="!filterable"
					:disabled="disabled"
					:value="displayInputRender"
					:size="size"
					:placeholder="inputPlaceholder"
					@on-change="handleInput"
				/>
				<div
					v-show="filterable && query === ''"
					:class="[prefixCls + '-label']"
					@click="handleFocus">{{ displayRender }}
				</div>
				<Icon v-show="showCloseIcon" :class="[prefixCls + '-arrow']" type="ios-close-circle" @click.native.stop="clearSelect"/>
				<Icon :class="[prefixCls + '-arrow']" type="ios-arrow-down"/>
			</slot>
		</div>
		<transition name="transition-drop">
			<Drop
				v-transfer-dom
				v-show="visible"
				ref="drop"
				:class="{ [prefixCls + '-transfer']: transfer }"
				:data-transfer="transfer"
				:transfer="transfer">
				<div>
					<reset-caspanel
						v-if="!filterable || (filterable && query === '')"
						ref="caspanel"
						:prefix-cls="prefixCls"
						:data="data"
						:disabled="disabled"
						:change-on-select="changeOnSelect"
						:trigger="trigger"
					/>
					<div v-if="filterable && query !== '' && querySelections.length" :class="[prefixCls + '-dropdown']">
						<ul :class="[selectPrefixCls + '-dropdown-list']" :style="{width:eleWidth+'px'}">
							<li
								v-for="(item, index) in querySelections"
								:class="[selectPrefixCls + '-item', {
									[selectPrefixCls + '-item-disabled']: item.disabled
								}]"
								:key="index"
								@click="handleSelectItem(index)"
								v-html="item.display"/>
						</ul>
					</div>
					<ul
						v-if="filterable && query !== '' && !querySelections.length"
						:class="[prefixCls + '-not-found-tip']"
						:style="{width:eleWidth+'px'}"

					>
						<li>{{ localeNotFoundText }}</li>
					</ul>
				</div>
			</Drop>
		</transition>
	</div>
</template>
<script>
import { directive as clickOutside } from 'v-click-outside-x';
import iInput from 'iview/src/components/input/input.vue';
import Drop from 'iview/src/components/select/dropdown.vue';
import Icon from 'iview/src/components/icon/icon.vue';
import TransferDom from 'iview/src/directives/transfer-dom';
import { oneOf } from 'iview/src/utils/assist';
import Emitter from 'iview/src/mixins/emitter';
import Locale from 'iview/src/mixins/locale';
import Caspanel from './caspanel.vue';

const prefixCls = 'ivu-cascader';
const selectPrefixCls = 'ivu-select';

export default {
	name: 'reset-cascader',  // eslint-disable-line
	components: { iInput, Drop, Icon, "reset-caspanel": Caspanel },
	directives: { clickOutside, TransferDom },
	mixins: [Emitter, Locale],
	props: {
		data: {
			type: Array,
			default() {
				return [];
			}
		},
		value: {
			type: Array,
			default() {
				return [];
			}
		},
		valueType: {
			type: String,
			default: 'number',
			validator: (val) => {
				return ['number', 'string'].includes(val);
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: String
		},
		size: {
			validator(value) {
				return oneOf(value, ['small', 'large', 'default']);
			},
			default() {
				return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
			}
		},
		trigger: {
			validator(value) {
				return oneOf(value, ['click', 'hover']);
			},
			default: 'click'
		},
		changeOnSelect: {
			type: Boolean,
			default: false
		},
		renderFormat: {
			type: Function,
			default(label) {
				return label.join(' / ');
			}
		},
		loadData: {
			type: Function
		},
		filterable: {
			type: Boolean,
			default: true
		},
		notFoundText: {
			type: String
		},
		transfer: {
			type: Boolean,
			default() {
				return !this.$IVIEW || this.$IVIEW.transfer === '' ? false : this.$IVIEW.transfer;
			}
		},
		name: {
			type: String
		},
		elementId: {
			type: String
		}
	},
	data() {
		return {
			prefixCls,
			selectPrefixCls,
			visible: false,
			selected: [],
			tmpSelected: [],
			updatingValue: false, // to fix set value in changeOnSelect type
			currentValue: this.value,
			query: '',
			validDataStr: '',
			isLoadedChildren: false, // #950，
			eleWidth: 0
		};
	},
	computed: {
		classes() {
			return [
				`${prefixCls}`,
				{
					[`${prefixCls}-show-clear`]: this.showCloseIcon,
					[`${prefixCls}-size-${this.size}`]: !!this.size,
					[`${prefixCls}-visible`]: this.visible,
					[`${prefixCls}-disabled`]: this.disabled,
					[`${prefixCls}-not-found`]: this.filterable && this.query !== '' && !this.querySelections.length
				}
			];
		},
		showCloseIcon() {
			return this.currentValue && this.currentValue.length && this.clearable && !this.disabled;
		},
		displayRender() {
			let label = [];
			for (let i = 0; i < this.selected.length; i++) {
				label.push(this.selected[i].label);
			}

			return this.renderFormat(label, this.selected);
		},
		displayInputRender() {
			return this.filterable ? '' : this.displayRender;
		},
		localePlaceholder() {
			if (this.placeholder === undefined) {
				return this.t('i.select.placeholder');
			} else {
				return this.placeholder;
			}
		},
		inputPlaceholder() {
			return this.filterable && this.currentValue.length ? null : this.localePlaceholder;
		},
		localeNotFoundText() {
			if (this.notFoundText === undefined) {
				return this.t('i.select.noMatch');
			} else {
				return this.notFoundText;
			}
		},
		querySelections() {
			let selections = this.getSelections(this.data) || [];
			selections = this.getLocationFromQuery(selections, this.query);
			return selections;
		}
	},
	watch: {
		visible(val) {
			if (val) {
				this.eleWidth = this.$el.clientWidth;
				if (this.currentValue.length) {
					setTimeout(() => {
						this.updateSelected();
					}, 0);
				}
				if (this.transfer) {
					setTimeout(() => {
						this.$refs.drop.update();
					}, 0);
				}
				this.broadcast('Drop', 'on-update-popper');
			} else {
				if (this.filterable) {
					this.query = '';
					this.$refs.input.currentValue = '';
				}
				if (this.transfer) {
					this.$refs.drop.destroy();
				}
				this.broadcast('Drop', 'on-destroy-popper');
			}
			this.$emit('on-visible-change', val);
		},
		value(val) {
			this.currentValue = val;
			if (!val.length) this.selected = [];
		},
		currentValue() {
			this.$emit('input', this.currentValue);
			if (this.updatingValue) {
				this.updatingValue = false;
				return;
			}
			if (this.filterable) {
				this.updateSelectedFilterable(this.currentValue);
			} else {
				this.updateSelected(true);
			}
		},
		data: {
			deep: true,
			handler() {
				const validDataStr = JSON.stringify(this.getValidData(this.data));
				if (validDataStr !== this.validDataStr) {
					this.validDataStr = validDataStr;
					if (!this.isLoadedChildren) {
						this.$nextTick(() => this.updateSelected(false, this.changeOnSelect));
					}
					this.isLoadedChildren = false;
				}
			}
		}
	},
	created() {
		this.validDataStr = JSON.stringify(this.getValidData(this.data));
		this.$on('on-result-change', (params) => {
			// lastValue: is click the final val
			// fromInit: is this emit from update value
			const lastValue = params.lastValue;
			const changeOnSelect = params.changeOnSelect;
			const fromInit = params.fromInit;

			if (lastValue || changeOnSelect) {
				const oldVal = JSON.stringify(this.currentValue);
				this.selected = this.tmpSelected;

				let newVal = [];
				this.selected.forEach((item) => {
					newVal.push(item.value);
				});

				if (!fromInit) {
					this.updatingValue = true;
					this.currentValue = newVal;
					this.emitValue(this.currentValue, oldVal);
				}
			}
			if (lastValue && !fromInit) {
				this.handleClose();
			}
		});
	},
	mounted() {
		this.updateSelected(true);
		this.eleWidth = this.$el.clientWidth;
	},
	methods: {
		clearSelect() {
			if (this.disabled) return false;
			const oldVal = JSON.stringify(this.currentValue);
			this.currentValue = [];
			this.selected = [];
			this.tmpSelected = [];
			this.handleClose();
			this.emitValue(this.currentValue, oldVal);
			//                this.$broadcast('on-clear');
			this.broadcast('reset-caspanel', 'on-clear');
		},
		handleClose() {
			this.visible = false;
		},
		toggleOpen() {
			if (this.disabled) return false;
			if (this.visible) {
				if (!this.filterable) this.handleClose();
			} else {
				this.onFocus();
			}
		},
		onFocus() {
			this.visible = true;
			if (!this.currentValue.length) {
				this.broadcast('reset-caspanel', 'on-clear');
			}
		},
		updateResult(result) {
			this.tmpSelected = result;
		},
		updateSelected(init = false, changeOnSelectDataChange = false) {
			// #2793 changeOnSelectDataChange used for changeOnSelect when data changed and set value
			if (!this.changeOnSelect || init || changeOnSelectDataChange) {
				this.broadcast('reset-caspanel', 'on-find-selected', {
					value: this.currentValue
				});
			}
		},
		updateSelectedFilterable(value) {
			let dataSource = this.data;
			const target = [];
			for (let i = 0; i < value.length; i++) {
				const exist = dataSource.find(item => item.value == value[i]);
				if (exist) {
					target.push({ label: exist.label, value: exist.value });
					dataSource = exist.children || [];
				} else {
					break;
				}
			}
			this.selected = target;
		},
		emitValue(val, oldVal) {
			if (JSON.stringify(val) !== oldVal) {
				this.$emit('on-change', this.currentValue, JSON.parse(JSON.stringify(this.selected)));
				this.$nextTick(() => {
					this.dispatch('FormItem', 'on-form-change', {
						value: this.currentValue,
						selected: JSON.parse(JSON.stringify(this.selected))
					});
				});
			}
		},
		handleInput(event) {
			this.query = event.target.value;
		},
		handleSelectItem(index) {
			const item = this.querySelections[index];

			if (item.item.disabled) return false;
			this.query = '';
			this.$refs.input.currentValue = '';
			const oldVal = JSON.stringify(this.currentValue);
			this.currentValue = item.value.split(',');
			if (this.valueType == 'number') {
				this.currentValue = this.currentValue.map(Number);
			}


			// use setTimeout for #4786, can not use nextTick, because @on-find-selected use nextTick
			setTimeout(() => {
				this.emitValue(this.currentValue, oldVal);
				this.handleClose();
			}, 0);
		},
		handleFocus() {
			this.$refs.input.focus();
		},
		// 排除 loading 后的 data，避免重复触发 updateSelect
		getValidData(data) {
			function deleteData(item) {
				const new_item = Object.assign({}, item);
				if ('loading' in new_item) {
					delete new_item.loading;
				}
				if ('__value' in new_item) {
					delete new_item.__value;
				}
				if ('__label' in new_item) {
					delete new_item.__label;
				}
				if ('children' in new_item && new_item.children.length) {
					new_item.children = new_item.children.map(i => deleteData(i));
				}
				return new_item;
			}
			return data.map(item => deleteData(item));
		},
		getSelections(arr, label, value, selections = []) {
			for (let i = 0; i < arr.length; i++) {
				let item = arr[i];
				item.__label = label ? label + ' / ' + item.label : item.label;
				item.__value = value ? value + ',' + item.value : item.value;

				if (item.children && item.children.length) {
					this.getSelections(item.children, item.__label, item.__value, selections);
					delete item.__label;
					delete item.__value;
				} else {
					selections.push({
						label: item.__label,
						value: item.__value,
						display: item.__label,
						item,
						disabled: !!item.disabled
					});
				}
			}
			return selections;
		},
		getLocationFromQuery(selections, query) {
			selections.forEach(item => {
				item.sameChar = [];
				const label = item.label.replace(/ |\//g, '');
				for (let i = 0; i < label.length; i++) {
					const char = label.charAt(i);
					if (query.includes(char) && !item.sameChar.find(_i => _i === char)) {
						item.sameChar.push(char);
					}
				}
			});
			selections = selections.filter(item => item.sameChar.length > 0);
			selections.sort((i, j) => j.sameChar.length - i.sameChar.length);
			if (selections.length > 20) {
				selections.length = 20;
			}
			selections.forEach(item => {
				item.sameChar.forEach(char => {
					item.display = item.display.replace(new RegExp(char, 'g'), `<span>${char}</span>`);
				});
			});
			return selections;
		}
	},
};
</script>
