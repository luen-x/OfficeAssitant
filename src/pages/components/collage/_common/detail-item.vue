<template>
	<span class="g-c-black2">{{ content ? content : "--" }}</span>
</template>

<script>
export default {
	name: "collage-detail-item",

	props: {
		content: [String, Array, Number]
	},

	methods: {}
};
</script>

<style lang="scss">
</style>