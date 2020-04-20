<template functional>
	<span 
		:style="{top: props.top, left: props.left }"
		class="g-absolute">
		<i 
			v-if="props.canAdd"
			:class="['g-c-blue-mid', 'g-fs-18', 'g-pointer']"
			class="icon iconfont iconfont icon-add1 g-c-blue-mid g-fs-18"
			@click="props.handleAdd"
		/>
		<i
			v-if="props.canRemove"
			:class="['g-c-red-light', 'g-fs-18', 'g-pointer']"
			class="icon iconfont icon-remove-circle g-c-red-light"
			@click="props.handleRemove"
		/>
	</span>
</template>

<script>
export default {
	props: {
		canAdd: {
			required: true,
			type: Boolean
		},
		canRemove: {
			required: true,
			type: Boolean
		},
		handleAdd: {
			type: Function
		},
		handleRemove: {
			type: Function
		},
		top: {
			type: String,
			default: '30px'
		},
		left: {
			type: String,
			default: '410px'
		}
	}
};
</script>

<style lang="scss" scoped>

</style>


