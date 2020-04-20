<template>
	<div class="v-show-default-title">{{ data.value }}</div>
</template>

<script>
export default {
	name: 'show-default-title',
	props: {
		data: Object
	}
};
</script>

<style lang="scss" scoped>
.v-show-default-title {
	height: 32px;
	line-height: 26px;
	padding: 3px 12px;
	background: #f0f4fc;
	text-align: center;
	border-radius: 4px;
}
</style>


