<template>
	<div 
		:style="[{ 
			height: `${h}px`, 
			width: `${w}px`, 
			color,
			fontSize: `${fs}px`,
			fontWeight: `${weight}`,
		}]"
	>
		{{ value }}
	</div>
</template>

<script>
export default {
	name: 'vm-input-viewer',
	components: {
	},
	props: {
		x: Number,
		y: Number,
		z: Number,
		w: Number,
		h: Number,
		r: Number,
		fs: Number | String,
		weight: Number | String,
		value: String,
	},
	data() {
		return {
		};
	},
	computed: {
		color: {
			 get() {
				return app.$store.state.hrToolModulesOfferAdd.color;
			},
			set(value) {
				app.$store.commit('HR_TOOL_MODULES_OFFER_ADD_COLOR', { color: value });
			},
		}
	},
	created() {
	},
	methods: {
		
	},
};
</script>

<style lang="scss" scoped>
</style>