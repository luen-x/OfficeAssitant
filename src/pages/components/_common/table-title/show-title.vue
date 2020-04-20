<template>
	<div class="v-show-title">
		<span class="_left">{{ data.value }}</span>
		<span class="_right" style="cursor:pointer" @click="$emit('hide', data.key )"><i class="iconfont icon-close" /></span>
	</div>
</template>

<script>
export default {
	name: 'show-title',
	props: {
		data: Object
	},
};
</script>

<style lang="scss" scoped>
.v-show-title {
	position: relative;
	height: 32px;
	background: #e84c57;
	border-radius: 4px;
	color: #fff;
	line-height: 20px;
	padding: 3px 5px 3px 5px;
	& > span {
		display: inline-block;
		padding: 3px 5px;
		margin-right: 2px;
		text-align: center;
	}
	& > ._right i{
		position: absolute;
		top: 7px;
		right: 5px;
	}
}
</style>


