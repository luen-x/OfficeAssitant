<template>
	<div class="v-sale-manul-upload" @click="handleClick" >
		<slot/>
		<input
			ref="input"
			v-bind="inputOption"
			type="file"
			style="display:none"
			@change="handleChange"
		>
	</div>
</template>
<script>
export default {
	name: 'oa-sale-manul-upload-input',
	components: {
	},
	props: {
		inputOption: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
		};
	},
	methods: {
		handleChange(e) {
			this.$emit('change', Array.prototype.slice.call(e.target.files));
			e.target.value = '';
		},
		handleClick() {
			this.$refs.input.click();
		}
	}
};
</script>
<style lang="scss">
.v-sale-manul-upload {
	display: inline-block;

}
</style>