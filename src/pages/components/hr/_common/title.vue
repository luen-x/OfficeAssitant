<template>
	<div class="c-hr-employee-title">
		<div class="_titles g-fs-14 g-flex g-ai-c">
			<span class="_name">{{ title }}</span>
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: "c-hr-employee-title",
	components: {},
	props: {
		title: {
			type: String,
			required: true
		}
	},
	data() {
		return {};
	},
	created() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
	.c-hr-employee-title {
		margin:20px 0px 20px 0px;
		._titles {
			color: #4B4F57;
			line-height: 16px;
			height:16px;
			padding-left: 10px;
			border-left: 2px solid #e74854;
		}
	}
</style>
