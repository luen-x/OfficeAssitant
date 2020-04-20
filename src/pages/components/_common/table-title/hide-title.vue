<template>
	<div class="v-hide-title">
		{{ data.value }}
		<div class="_mask" @click="$emit('add', data.key)">添加</div>
	</div>
</template>

<script>
export default {
	name: 'hide-title',
	props: {
		data: Object
	}
};
</script>

<style lang="scss" scoped>
.v-hide-title {
	height: 32px;
	line-height: 26px;
	padding: 3px 12px;
	background: #f0f4fc;
	text-align: center;
	border-radius: 4px;
	margin: 10px;
	position: relative;
	overflow: hidden;

	& > ._mask {
		opacity: 0;
		position: absolute;
		color: #fff;
		left: 0;
		top: 0;
		width: 100%;
		height: 32px;
		line-height: 32px;
		cursor: pointer;
		background: rgba(0, 0, 0, 0.6);
	}
	&:hover > ._mask {
		opacity: 1;
		transition: opacity .5s;
	}
}
</style>


