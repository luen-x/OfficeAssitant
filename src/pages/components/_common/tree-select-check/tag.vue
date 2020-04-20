<template>
	<div class="vc-tree-select-tag">
		<div :style="styles" class="__text">{{ dataSource.title }}</div>
		<i class="__delete" @click="handleDelete"/>
	</div>
</template>

<script>
export default {
	name: "vc-tree-select-tag",
	props: {
		dataSource: {
			type: Object,
		},
		maxWidth: {
			type: [Number, String],
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		styles() {
			// 计算最大显示宽度，超过用省略号显示
			let maxWidth = this.maxWidth - 60 + 'px';
			return {
				maxWidth
			};
		}
	},
	methods: {
		handleDelete(e) {
			if (!this.disabled) {
				e.stopPropagation();
				this.$emit('delete', this.dataSource);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.vc-tree-select-tag {
	display: inline-block;
    height: 22px;
    line-height: 22px;
    margin: 2px 4px 2px 0;
	padding-left: 8px;
	padding-right: 18px;
    border: 1px solid #e9eaec;
    border-radius: 3px;
    background: #f7f7f7;
    font-size: 12px;
    vertical-align: middle;
    opacity: 1;
    overflow: hidden;
    cursor: pointer;
	position: relative;

	.__delete {
		font-size: 14px;
		display: inline-block;
		-webkit-transform: scale(1.42857143) rotate(0);
		transform: scale(1.42857143) rotate(0);
		cursor: pointer;
		color: #666;
		opacity: .66;
		font-family: Ionicons;
		font-style: normal;
		font-weight: 400;
		font-variant: normal;
		text-transform: none;
		text-rendering: auto;
		line-height: 1;
		-webkit-font-smoothing: antialiased;

		position: absolute;
		top: 3px;
		right: 2px;
		&::before {
			content: "\F178";
			box-sizing: border-box;
		}
	}
	.__text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
