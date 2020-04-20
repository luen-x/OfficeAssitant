<template>
	<div :class="routes.length > 0 && 'g-pd-t-50'" class="g-reset"> 
		<oa-breadcrumb 
			v-if="routes.length > 0" 
			:routes="routes"
			:before-back="beforeBack"
		/>
		<slot />
	</div>
</template>
<script>
import Breadcrumb from "../breadcrumb/breadcrumb";

export default {
	name: "set-title",
	components: {
		'oa-breadcrumb': Breadcrumb
	},
	props: {
		title: String,
		isShowBack: {
			default: true,
			type: Boolean
		},
		offset: {
			type: Number,
			default: -45
		},
		routes: {
			type: Array,
			default: () => ([])
		},
		beforeBack: Function
	},
	data() {
		return {
			path: this.$route.path
		};
	},
	computed: {
		
	},
	mounted() {
		document.title = this.title || document.title;
	},
	beforeDestroy() {
	},
	methods: {
		handleClick() {
			this.$router.back();
		}
	}
};
</script>
<style lang="scss" scoped>

</style>