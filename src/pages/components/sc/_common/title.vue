<template>
	<div class="c-detail-title g-flex g-ai-c">
		<span class="_left" />
		<span class="_right">
			{{ title }}
			<slot/>
		</span>
	</div>
</template>

<script>
export default {
	name: 'oa-detail-title',
	props: {
		title: String
	}
};
</script>

<style lang="scss">
.c-detail-title {
	._left {
		background: #e84854;
		width: 2px;
		height: 14px;
		display: inline-block;
		margin-right: 10px;
	}
	._right {
		color: #4b4f57 !important;
		font-size: 14px;
	}
}
</style>


