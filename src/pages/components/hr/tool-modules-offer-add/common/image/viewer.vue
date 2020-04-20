<template>
	<div :style="[{ height: `${h}px`, width: `${w}px` }]">
		<img v-if="/^((https|http)?:\/\/)/.test(value[0])" :src="value[0]" style="width: 100%; height: 100%; object-fit:cover">
	</div>
</template>

<script>
export default {
	name: 'vm-text-viewer',
	components: {
	},
	props: {
		x: Number,
		y: Number,
		z: Number,
		w: Number,
		h: Number,
		r: Number,
		value: Array
	},
	data() {
		return {
		};
	},
	computed: {
	},
	created() {
	},
	methods: {
		
	},
};
</script>

<style lang="scss" scoped>
</style>