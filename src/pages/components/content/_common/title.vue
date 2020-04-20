<template>
	<div style="height: 30px">
		<span class="g-pd-l-10 _title _border g-relative g-fs-14" style="margin-left: 10px; color: #333">{{ title }}</span>
		<slot/>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			require: true,
			type: String
		}
	}
};
</script>

<style lang="scss" scoped>
._border::before {
	top: 4px;
	left: -3px;
	content: '';
	height: 14px;
	width: 2px;
	position: absolute;
	background: #ca1622;
}
</style>


