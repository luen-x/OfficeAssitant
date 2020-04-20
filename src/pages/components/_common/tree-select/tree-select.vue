<template>
	<div 
		v-click-outside.capture="onClickOutside"
		v-click-outside:mousedown.capture="onClickOutside"
		class="vc-tree-select" 
	>
		<div
			ref="reference"
			:class="{'active': dropdownShow}"
			:style="disabled?disabledStyles:inputStyles"
			class="__input"
			@click="handleClickHead"
		>
			<div v-if="!selections.length && !filterable" class="__placeholder">
				{{ placeholder }}
			</div>
			<template v-else>
				<vc-tree-select-tag
					v-for="(item, index) in labelInValue ? selections : selectedTag"
					:key="index"
					:data-source="item"
					:max-width="maxWidth"
					@delete="handleDeleteTag"
				/>
			</template>
			<input 
				v-if="filterable"
				ref="input"
				:style="inputStyle"
				:disabled="disabled"
				v-model="query"
				:placeholder="selections.length?'':placeholder"
				style="outline:none" 
				@input="handleQueryChange" 
			>
			<div :class="(selections.length > 0 ) && '__icon-hover'" class="__icon" @mousedown.prevent @click.stop>
				<i-icon type="ios-arrow-down" class="__icon-arrow" @click="handleToggleDropdown"/>
				<i-icon
					:class="'__icon-close'"
					type="ios-close-circle"
					@click.stop="handleClear"
					@mousedown.prevent
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
				<ul v-if="filteredDataSource.length==0" class="__wrap g-tc g-c-black3">无匹配数据</ul>
				<ul
					v-for="(item, index) in filteredDataSource"
					:key="index"
					class="__wrap"
				>
					<vc-tree-select-item
						:data-source="item"
						:selections="selections"
						:last-select="lastSelect"
						:label-in-value="labelInValue"
						@select="handleChangeSelect"
					/>
				</ul>
				<!-- </div> -->
				
			</i-select-drop>
			
		</transition>
	</div>
</template>
<script>
import { Icon } from 'iview';
import { directive as clickOutside } from 'v-click-outside-x';
import TransferDom from 'iview/src/directives/transfer-dom';
import Drop from '../iview-reset/select/dropdown.vue';
import TreeSelectItem from './item';
import TreeSelectTag from './tag';

const prefixCls = 'ivu-select';


export default {
	name: "vc-tree-select",
	components: {
		'i-icon': Icon,
		'vc-tree-select-item': TreeSelectItem,
		'vc-tree-select-tag': TreeSelectTag,
		'i-select-drop': Drop
	},
	directives: { clickOutside, TransferDom },
	model: {
		prop: 'selections',
		event: 'change'
	},
	props: {
		selections: {
			type: Array,
		},
		dataSource: {
			type: Array,
			default() {
				return [];
			}
		},
		width: {
			type: [Number],
			default: 200
		},
		maxWidth: {
			type: [Number],
			default: 200
		},
		dropdownMaxHeight: {
			type: [Number],
			default: 300
		},
		inputMaxHeight: {
			type: [Number],
			default: null
		},
		placeholder: {
			type: String,
			default: ''
		},
		labelInValue: Boolean,
		lastSelect: {
			type: Boolean,
			default: false
		},
		filterable: {
			type: Boolean,
			default: true
		},
		transfer: {
			type: Boolean,
			default: true
		},
		transferClassName: String,
		disabled: Boolean

		
	},
	data() {
		return {
			dropdownShow: false,
			dropdownStyles: {},
			inputStyles: {},
			disabledStyles: {},
			selectedTag: [],
			query: '',
			inputLength: this.width - 35,
			filteredDataSource: JSON.parse(JSON.stringify(this.dataSource)),
		};
	},
	computed: {
		showPlaceholder() {
			if (this.filterable) {
				return 	this.selections.length == 0 && this.query == ''; 
			} else {
				return 	this.selections.length == 0; 
			}
			

		},
		inputStyle() {
			let style = {};
			if (this.showPlaceholder) {
				style.width = this.width - 35 + 'px';
			} else {
				style.width = `${this.inputLength}px`;
			}
			if (this.disabled) {
				style.backgroundColor = "#f3f3f3";
				style.cursor = 'not-allowed';
			}
			

			return style;
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
		selections(newVal) {
			if (!this.labelInValue && this.dataSource.length > 0) {
				this.selectedTag = this.getSelectedTag(this.dataSource, newVal);
			}
			this.dispatch('FormItem', 'on-form-change', newVal);
			// if (this.transfer) {
			// 	this.$refs.dropdown.update();
			// }
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
		dataSource(newVal) {
			if (!this.labelInValue) {
				this.selectedTag = this.getSelectedTag(newVal, this.selections);
			}
			this.filteredDataSource = JSON.parse(JSON.stringify(this.dataSource));
		}
	},
	created() {
		this.dropdownStyles = {
			width: `${this.width}px`,
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
	mounted() {
		if (!this.labelInValue && this.dataSource.length > 0 && this.selections.length > 0) {
			this.selectedTag = this.getSelectedTag(this.dataSource, this.selections);
			this.dispatch('FormItem', 'on-form-change', this.selections);
		}
	},
	methods: {
		/**
		 * 清空数据
		 */
		handleClear() {
			this.$emit('change', []);
			this.$emit('delete', []);
			this.updateStyles();
			this.filterable && (this.$refs.input.value = '');
			this.filterable && this.handleQueryChange();
		},
		/**
		 *	删除标签后更新数据
		*/
		handleDeleteTag(item) {
			let selected = this.selections.filter((it) => {
				return (this.labelInValue ? it.value : it) != item.value;
			});
			this.$emit('change', selected);
			this.$emit('delete', item);
			this.updateStyles();
			
		},

		/**
		 *	下拉框选择操作后更新数据
		*/
		handleChangeSelect(item) {
			this.$emit('change', item);
			this.$emit('change-select', item);
			this.updateStyles();
			this.query = '';
		},

		/**
		 *	通过判断label和value值是否一致，判断是否存在
		 *	通过判断_checked值，判断添加删除
		*/
		// updateSelection({ label, value, _checked }) {
		// 	this.selections = this.selections.filter(item => {
		// 		return item.label !== label && item.value !== value;
		// 	});
		// 	if (_checked) {
		// 		this.selections.push({ label, value });
		// 	}
		// },

		/**
		 *	操作之后更新下拉框的位置
		*/
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
		handleToggleDropdown() {
			if (this.disabled) return;
			this.dropdownShow = !this.dropdownShow;
			this.updateStyles();
		},
		handleClickHead() {
			if (this.disabled) return;
			this.handleToggleDropdown();
			this.$refs.input.focus();
		},
		handleBlur() {
			this.dropdownShow = false;
			this.$emit('blur');
		},
		getSelectedTag(target, selected = []) {
			let arr = [];
			for (let i = 0; i < target.length; i++) {
				if (selected.indexOf(target[i].value) > -1) {
					arr.push(target[i]);
				}
				if (target[i].children && target[i].children.length > 0) {
					arr = [...arr, ...this.getSelectedTag(target[i].children, selected)];
				}
			}
			return arr;
		},
		handleQueryChange(event) {
			const query = this.$refs.input.value;
			const target = JSON.parse(JSON.stringify(this.dataSource));
			if (query) {
				this.deleteLeaf(target, query);
				this.setExpand(target, query);
			}
			this.filteredDataSource = target;
			this.dropdownShow = true;
			this.updateInputState();
			this.updateStyles();
		},
		deleteLeaf(data, query) {
			for (let i = 0; i < data.length; i++) {
				const item = data[i];
				if (!item.label.includes(query)) {
					if (item.children && item.children.length) {
						const hasLeaf = this.deleteLeaf(item.children, query);
						if (!hasLeaf) {
							data.splice(i, 1);
							i--;
						}
					} else if (!item.label.includes(query)) {
						data.splice(i, 1);
						i--;
					}
				}
			}
			return data.length;
		},
		setExpand(data, query, parent) {
			data.forEach(item => {
				if (item.children && item.children.length) {
					this.setExpand(item.children, query, item);
					if (item.children.find(i => i.label.includes(query) || i._expand)) {
						item._expand = true;
						parent && (parent._expand = true);
					}
				}
			});
		},
		onClickOutside(event) {
			if (this.dropdownShow) {
				if (this.transfer) {
					const { $el } = this.$refs.dropdown;
					if ($el === event.target || $el.contains(event.target)) {
						return;
					}
				}
				this.dropdownShow = false;
			}
			
		},
		updateInputState() {
			const length = this.$refs.input.value.length * 12 + 20;
			const maxLength = this.$el.clientWidth - 35;
			if (this.selections.length == 0) return maxLength;
			if (maxLength > length) {
				this.inputLength = length;
			} else {
				this.inputLength = maxLength;
			}
			//  this.$emit('on-keydown');
		},

	}
};
</script>
<style lang="scss">
.ivu-form-item-error {
	.vc-tree-select {
		.__input {
			border: 1px solid #ed4014;
		}
		.__icon,.__icon-arrow {
			color: #ed4014;
		}
		.active {
			box-shadow: 0 0 0 2px rgba(237, 64, 20, 0.2);
		}
	}

}

.vc-tree-select {
	display: inline-block;

	position: relative;
	&:focus {
		outline: none;
	}
	.__input {
		min-height: 32px;
		overflow-y: auto;

		display: flex;
		flex-wrap: wrap;
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

		padding: 0px 24px 0px 4px;
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
		// input::-webkit-input-placeholder {
		// 	color: #333;
		// }
	}

	// .__dropdown {
	// 	overflow: auto;
	// 	margin: 5px 0;
	// 	padding: 5px;
	// 	background-color: #fff;
	// 	box-sizing: border-box;
	// 	border-radius: 4px;
	// 	box-shadow: 0 1px 6px rgba(0,0,0,.2);
	// 	transform-origin: center top 0px;

	// 	position: absolute;
	// 	top: 34px;
	// 	left: 0;
	// 	z-index: 900;

	// 	ul {
	// 		width: 100%;
	// 	}

	// 	.__wrap {
	// 		> li {
	// 			padding-left: 0;
	// 		}
	// 	}
	// }

	// .slide-enter-active, .slide-leave-active {
	// 	transition: all .3s;
	// }
	// .slide-enter, .slide-leave-to {
	// 	opacity: 0;
	// 	transform: scaleY(.8);
	// }
	// .slide-leave, .slide-enter-to {
	// 	opacity: 1;
	// 	transform: scaleY(1);
	// }

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
	
}
</style>
