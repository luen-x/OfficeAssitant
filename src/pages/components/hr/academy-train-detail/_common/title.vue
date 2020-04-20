<template>
	<div class="_title g-flex g-ai-c">
		<div class="__title-left"/>
		<div class="__title-right">
			<slot name="title"/>
			<slot/>
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
	.__title-left {
		background: #e84854;
		width: 2px;
		height: 14px;
		display: inline-block;
		margin-right: 10px;
	}
	.__title-right {
		color: #333;
		font-size: 14px;
	}
}
</style>