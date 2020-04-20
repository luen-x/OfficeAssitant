<template>
	<span>
		<ul v-if="data && data.length" :class="[prefixCls + '-menu']">
			<Casitem
				v-for="item in data"
				:key="getKey()"
				:prefix-cls="prefixCls"
				:data="item"
				:tmp-item="tmpItem"
				@click.native.stop="handleClickItem(item)"
				@mouseenter.native.stop="handleHoverItem(item)"/>
		</ul>
		<reset-caspanel 
			v-if="sublist && sublist.length" 
			:prefix-cls="prefixCls" 
			:data="sublist" 
			:disabled="disabled" 
			:trigger="trigger" 
			:change-on-select="changeOnSelect"/>
	</span>
</template>
<script>
import Emitter from 'iview/src/mixins/emitter';
import { findComponentUpward, findComponentDownward } from 'iview/src/utils/assist';
import Casitem from './casitem.vue';

let key = 1;

export default {
	name: 'reset-caspanel',
	components: { "Casitem": Casitem },
	mixins: [Emitter],
	props: {
		data: {
			type: Array,
			default() {
				return [];
			}
		},
		disabled: Boolean,
		changeOnSelect: Boolean,
		trigger: String,
		prefixCls: String
	},
	data() {
		return {
			tmpItem: {},
			result: [],
			sublist: []
		};
	},
	watch: {
		data() {
			this.sublist = [];
		}
	},
	mounted() {
		this.$on('on-find-selected', (params) => {
			const val = params.value;
			let value = [...val];
			for (let i = 0; i < value.length; i++) {
				for (let j = 0; j < this.data.length; j++) {
					if (value[i] === this.data[j].value) {
						this.handleTriggerItem(this.data[j], true);
						value.splice(0, 1);
						this.$nextTick(() => {
							this.broadcast('reset-caspanel', 'on-find-selected', {
								value
							});
						});
						return false;
					}
				}
			}
		});
		// deep for #1553
		this.$on('on-clear', (deep = false) => {
			this.sublist = [];
			this.tmpItem = {};
			if (deep) {
				const Caspanel = findComponentDownward(this, 'reset-caspanel');
				if (Caspanel) {
					Caspanel.$emit('on-clear', true);
				}
			}
		});
	},
	methods: {
		handleClickItem(item) {
			if (this.trigger !== 'click' && item.children && item.children.length) return; // #1922
			this.handleTriggerItem(item, false, true);
		},
		handleHoverItem(item) {
			if (this.trigger !== 'hover' || !item.children || !item.children.length) return; // #1922
			this.handleTriggerItem(item, false, true);
		},
		handleTriggerItem(item, fromInit = false, fromUser = false) {
			if (item.disabled) return;

			const cascader = findComponentUpward(this, 'reset-cascader');
			if (item.loading !== undefined && !item.children.length) {
				if (cascader && cascader.loadData) {
					cascader.loadData(item, () => {
						// todo
						if (fromUser) {
							cascader.isLoadedChildren = true;
						}
						if (item.children.length) {
							this.handleTriggerItem(item);
						}
					});
					return;
				}
			}

			// return value back recursion  // 向上递归，设置临时选中值（并非真实选中）
			const backItem = this.getBaseItem(item);
			// #5021 for this.changeOnSelect，加 if 是因为 #4472
			if (
				this.changeOnSelect
                    || (backItem.label !== this.tmpItem.label || backItem.value !== this.tmpItem.value)
                    || (backItem.label === this.tmpItem.label && backItem.value === this.tmpItem.value)
			) {
				this.tmpItem = backItem;
				this.emitUpdate([backItem]);
			}

			if (item.children && item.children.length) {
				this.sublist = item.children;
				this.dispatch('reset-cascader', 'on-result-change', {
					lastValue: false,
					changeOnSelect: this.changeOnSelect,
					fromInit
				});

				// #1553
				if (this.changeOnSelect) {
					const Caspanel = findComponentDownward(this, 'reset-caspanel');
					if (Caspanel) {
						Caspanel.$emit('on-clear', true);
					}
				}
			} else {
				this.sublist = [];
				this.dispatch('reset-cascader', 'on-result-change', {
					lastValue: true,
					changeOnSelect: this.changeOnSelect,
					fromInit
				});
			}

			if (cascader) {
				cascader.$refs.drop.update();
			}
		},
		updateResult(item) {
			this.result = [this.tmpItem].concat(item);
			this.emitUpdate(this.result);
		},
		getBaseItem(item) {
			let backItem = Object.assign({}, item);
			if (backItem.children) {
				delete backItem.children;
			}

			return backItem;
		},
		emitUpdate(result) {
			if (this.$parent.$options.name === 'reset-caspanel') {
				this.$parent.updateResult(result);
			} else {
				this.$parent.$parent.updateResult(result);
			}
		},
		getKey() {
			return key++;
		}
	},
};
</script>
