<template>
	<li class="vc-tree-select-item">
		<div 
			:class="{'__checked': isChecked}" 
			class="__item" 
			@click.stop="handleSelect"
			@mousedown.prevent
		>
			<span v-if="canExpand" class="g-pd-r-5" @click.stop="expand=!expand">			
				<i v-if="!expand" class="iconfont icon-triangle-up g-fs-12" style="display:inline-block;transform: rotate(90deg);" />
				<i v-else class="iconfont icon-triangle-down g-fs-12" />
			</span>
			{{ dataSource.label }} 
			
		</div>
		<ul v-if="expand">
			<vc-tree-select-item
				v-for="(item, index) in dataSource.children"
				:selections="selections"
				:key="index"
				:data-source="item"
				:label-in-value="labelInValue"
				:last-select="lastSelect"
				@select="handleChangeSelect"
			/>
		</ul>
	</li>
</template>

<script>
export default {
	name: "vc-tree-select-item",
	props: {
		dataSource: {
			type: Object,
		},
		selections: {
			type: Array,
			default() {
				return [];
			}
		},
		labelInValue: Boolean,
		lastSelect: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			expand: this.dataSource._expand || false,
			canExpand: this.dataSource.children && this.dataSource.children.length
		};
	},
	computed: {
		isChecked() {
			return this.selections.some((item) => ((this.labelInValue ? item.value : item) == this.dataSource.value));
		}
	},
	watch: {
		dataSource(newVal) {
			this.canExpand = newVal.children && newVal.children.length;
			this.expand = this.dataSource._expand || false;
		}
	},
	mounted() {
	},
	methods: {
		handleSelect(e) {
			if (this.lastSelect) {
				if (!this.canFolder) {
					this.handleSelectTag(e);
				}
			} else {
				this.handleSelectTag(e);
			}
		},
		handleSelectTag(e) {
			e.stopPropagation();
			let selected = [];
			if (this.isChecked) {
				selected = this.selections.filter((it) => (this.labelInValue ? it.value : it) != this.dataSource.value);
			} else {
				selected = [...this.selections, this.labelInValue ? this.dataSource : this.dataSource.value];
			}
			this.$emit('select', selected);
		},
		handleChangeSelect(v) {
			this.$emit('select', v);
		}
	}
};
</script>

<style lang="scss" scoped>
.vc-tree-select-item {
	list-style: none;
	padding-left: 10px;
	ul {
		list-style: none;
		li {
			list-style: none;
		}
	}

	.__item {
		border-radius: 3px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 5px;
		padding-right: 20px;
		box-sizing: border-box;
		transition: background .2s ease-in-out;

		position: relative;

		&:hover {
			background-color: #f3f3f3;
			cursor: pointer;
		}
	}
	.__checked {
		color: rgba(45,140,240,.9);

		&::after {
			display: inline-block;
			font-family: Ionicons;
			font-style: normal;
			font-weight: 400;
			font-variant: normal;
			text-transform: none;
			text-rendering: auto;
			line-height: 1;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			font-size: 24px;
			content: "\F171";
			color: rgba(45,140,240,.9);
			position: absolute;
			top: 8px;
			right: 0;
		}
	}
}
</style>
