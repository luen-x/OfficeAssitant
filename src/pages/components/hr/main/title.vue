<template>
	<div class="v-title g-flex g-ai-c">
		<span class="_left" />
		<span class="_right">{{ title }}</span>
	</div>
</template>

<script>
export default {
	name: 'oa-title',
	props: {
		title: String
	}
};
</script>

<style lang="scss">
.v-title {
	._left {
		background: #e84854;
		width: 2px;
		height: 14px;
		display: inline-block;
		margin-right: 10px;
	}
	._right {
		color: #4b4f54;
		font-size: 14px;
	}
}
</style>