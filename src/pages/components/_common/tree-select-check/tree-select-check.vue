<template>
	<div
		v-click-outside.capture="onClickOutside"
		v-click-outside:mousedown.capture="onClickOutside"
		class="vc-tree-select-check"
		tabindex="1"
	>
		<div
			ref="reference"
			:class="{'active': dropdownShow}"
			:style="disabled ? disabledStyles : inputStyles"

			class="__input"
			@click="handleShowDropdown"
		>
			<div v-if="!filteredCheckedTags.length" :class="disabled ? '__placeholder-disabled' : '__placeholder'">
				{{ placeholder }}
			</div>
			<template v-else>
				<vc-tree-select-tag
					v-for="(item, index) in filteredCheckedTags"
					:key="index"
					:data-source="item"
					:max-width="maxWidth"
					:disabled="disabled"
					@delete="handleDeleteTag"
				/>
			</template>
			<div v-if="!disabled" :class="filteredCheckedTags.length > 0 && '__icon-hover'" class="__icon">
				<i-icon type="ios-arrow-down" class="__icon-arrow"/>
				<i-icon
					:class="'__icon-close'"
					type="ios-close-circle"
					@click.stop="handleClear"
				/>
			</div>
		</div>
		<transition name="transition-drop">
			<i-select-drop
				v-transfer-dom
				v-show="dropdownShow"
				ref="dropdown"
				:style="dropdownStyles"
				:data-transfer="transfer"
				:transfer="transfer"
				:class="dropdownCls"
				:class-name="transferClassName"
			>
				<!-- <div v-show="dropdownShow" ref="dropdown" :style="dropdownStyles" class="__dropdown"> -->
				<i-tree
					ref="tree"
					:data="data"
					show-checkbox
					check-directly
					multiple
					style="padding-left:5px"
					@on-check-change="handleCheckChange"/>
					<!-- </div> -->
			</i-select-drop>
		</transition>
	</div>
</template>
<script>
import { Icon, Tree } from 'iview';
import { directive as clickOutside } from 'v-click-outside-x';
import TransferDom from 'iview/src/directives/transfer-dom';
import Drop from '../iview-reset/select/dropdown.vue';

import TreeSelectTag from './tag';

const prefixCls = 'ivu-select';

export default {
	name: "vc-tree-select",
	components: {
		'i-icon': Icon,
		'i-tree': Tree,
		'vc-tree-select-tag': TreeSelectTag,
		'i-select-drop': Drop


	},
	directives: { clickOutside, TransferDom },
	props: {
		value: {
			type: Array,
			default: () => []
		},
		data: { // ivew tree 树结构
			type: Array,
			default() {
				return [];
			}
		},
		width: {
			type: [Number, String],
			default: 200
		},
		maxWidth: {
			type: [Number, String],
			default: 200
		},
		dropdownMaxHeight: {
			type: [Number, String],
			default: 300
		},
		inputMaxHeight: {
			type: [Number, String],
			default: 69
		},
		placeholder: {
			type: String,
			default: ''
		},
		labelInValue: Boolean,
		disabled: {
			type: Boolean,
			default: false
		},
		transfer: {
			type: Boolean,
			default: true
		},
		transferClassName: String
	},
	data() {
		return {
			dropdownShow: false,
			dropdownStyles: {},
			inputStyles: {},
			checkedTags: [],
			disabledStyles: {}
		};
	},
	computed: {
		filteredCheckedTags() {
			let toRemove = [];
			this.checkedTags.forEach(tag => {
				if (tag.children && tag.children.length > 0) {
					let childrenFull = true;
					for (let i = 0; i < tag.children.length; i++) {
						if (!this.checkedTags.find(item => item.value === tag.children[i].value)) {
							childrenFull = false;
							break;
						}
					}
					if (childrenFull) {
						toRemove = [...toRemove, ...tag.children];
					}
				}
			});
			return this.checkedTags.filter(tag => !toRemove.includes(tag));
		},
		dropdownCls() {
			return {
				[prefixCls + '-dropdown-transfer']: this.transfer,
				[prefixCls + '-multiple']: this.multiple && this.transfer,
				'ivu-auto-complete': this.autoComplete,
				[this.transferClassName]: this.transferClassName
			};
		},
	},
	watch: {
		value(newVal, oldVal) {
			if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
				this.initValue();
			}
		},
		data(newVal, oldVal) {
			if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
				this.initValue();
			}
		},
		dropdownShow(v) {
			const event = v ? 'slide-down' : 'slide-up';
			this.$emit(event);
			if (this.transfer) {
				setTimeout(() => {
					this.$refs.dropdown.update();
				}, 0);
			}
		},
		filteredCheckedTags(newVal, oldVal) {
			if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
				this.dispatch('FormItem', 'on-form-change', newVal);
			}
		}
	},
	mounted() {
		if (this.value.length > 0) this.initValue();
	},
	created() {
		this.dropdownStyles = {
			minWidth: `${this.width}px`,
			maxWidth: `${this.maxWidth}px`,
			maxHeight: `${this.dropdownMaxHeight}px`,
			transformOrigin: 'center top'

		};
		this.inputStyles = {
			width: `${this.width}px`,
			// minWidth: `${this.width}px`,
			// maxWidth: `${this.maxWidth}px`,
			maxHeight: `${this.inputMaxHeight}px`
		};
		this.disabledStyles = {
			width: `${this.width}px`,
			maxHeight: `${this.inputMaxHeight}px`,
			color: `#ccc`,
			backgroundColor: `#f3f3f3`,
			cursor: `not-allowed`,
			opacity: `1`
		};
	},
	updated() {
		if (this.transfer) {
			this.$refs.dropdown.update();
		}
	},
	methods: {
		/**
		 * 清空数据
		 */
		handleClear() {
			this.filteredCheckedTags.forEach(item => {
				this.$refs.tree.handleCheck({ checked: false, nodeKey: item.nodeKey });
			});

			this.$emit('change', []);
			this.$emit('delete', []);
			this.updateStyles();
		},
		/**
		 *	删除标签后更新数据
		*/
		handleDeleteTag(item) {
			this.$refs.tree.handleCheck({ checked: false, nodeKey: item.nodeKey });
			this.$emit('input', this.labelInValue ? this.filteredCheckedTags : this.filteredCheckedTags.map(it => it.value));

			this.$emit('change', this.filteredCheckedTags);
			this.$emit('delete', item);
			this.updateStyles();
		},
		handleCheckChange(val) {
			this.checkedTags = val;
			this.$emit('input', this.labelInValue ? this.filteredCheckedTags : this.filteredCheckedTags.map(item => item.value));
			this.updateStyles();

		},
		updateStyles() {
			this.$nextTick(() => {
				const top = this.$refs.reference.offsetHeight + 'px';
				const width = this.$refs.reference.offsetWidth + 'px';
				this.dropdownStyles = { ...this.dropdownStyles, top };
			});
		},

		/**
		 *	下拉框显示切换
		*/
		handleShowDropdown() {
			if (!this.disabled) {
				this.dropdownShow = !this.dropdownShow;
				this.updateStyles();
			}
		},
		onClickOutside() {
			if (this.dropdownShow) {
				if (this.transfer) {
					const { $el } = this.$refs.dropdown;
					if ($el === event.target || $el.contains(event.target)) {
						return;
					}
				}
				this.dropdownShow = false;
			}
			// this.dropdownShow = false;
			// this.$emit('blur');
		},
		initValue() {
			this.setChecked(this.data, this.value);
			this.$nextTick(() => {
				this.checkedTags = this.$refs.tree.getCheckedNodes();
			});
		},
		findNode(arr, value) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].value === value) {
					return arr[i];
				} else if (arr[i].children && arr[i].children.length > 0) {
					const exist = this.findNode(arr[i].children, value);
					if (exist) {
						return exist;
					}

				}
			}
		},
		setChecked(arr, values) {
			for (let i = 0; i < arr.length; i++) {
				if (values.includes(arr[i].value)) {
					arr[i].checked = true;
				} else {
					arr[i].checked = false;
				}
				if (arr[i].children && arr[i].children.length > 0) {
					 this.setChecked(arr[i].children, values);
				}
			}
		},
	}
};
</script>
<style lang="scss">
.ivu-form-item-error {
	.vc-tree-select-check {
		.__input {
			border-color: rgb(237, 64, 20)
		}
		.active {
			box-shadow: 0 0 0 2px rgba(237, 64, 20,.2);
		}
	}	
}
.vc-tree-select-check {
	display: inline-block;
	position: relative;
	&:focus {
		outline: none;
	}
	.ivu-tree-title-selected{
		background-color: white;
		&:hover{
			background-color: #eaf4fe;
		}
	}
	.__input {
		min-height: 32px;
		overflow-y: auto;
		line-height: 26px;
		display: block;
		box-sizing: border-box;
		outline: 0;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		cursor: pointer;
		position: relative;
		background-color: #fff;
		border-radius: 4px;
		border: 1px solid #dddee1;
		transition: all .2s ease-in-out;

		padding: 2px 24px 2px 4px;
		.__icon {
			line-height: 1;
			margin-top: -7px;
			font-size: 14px;
			color: #80848f;
			transition: all .2s ease-in-out;
			display: inline-block;
			line-height: 1;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			position: absolute;
			top: 50%;
			right: 8px;
			.__icon-close {
				display: none;
			}
			.__icon-arrow {
				display: inline-block;
				transition: all .2s ease-in-out;
			}

		}
		.__icon-hover {
			&:hover {
				.__icon-close {
					display: inline-block;
				}
				.__icon-arrow {
					display: none;
				}
			}
		}
	}
	.active {
		border-color: #57a3f3;
		outline: 0;
		box-shadow: 0 0 0 2px rgba(45,140,240,.2);

		.__icon-arrow {
			transform: rotate(180deg);
		}
	}

	.__placeholder {
		height: 26px;
		line-height: 26px;
		padding-left: 4px;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #333;
	}
	.__placeholder-disabled {
		height: 26px;
		line-height: 26px;
		padding-left: 4px;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #ccc;
	}
	
}
</style>
