<template>
	<div class="_title g-flex g-ai-c">
		<div class="_left"/>
		<div class="_right">
			<slot name="title"/>
		</div>
	</div>
</template>

<script>
export default {
	name: 'detail-title'
};
</script>

<style lang="scss" scoped>
._title {
	position: relative;
	left: -12px;
	._left {
		background: #e84854;
		width: 2px;
		height: 14px;
		display: inline-block;
		margin-right: 10px;
	}
	._right {
		color: #333;
		font-size: 14px;
	}
}
</style>


