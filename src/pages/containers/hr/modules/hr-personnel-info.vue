<template>
	<set-title 
		title="个人资料" 
		style="padding: 20px,overflow-x: auto">
		<oa-content class="hr-personnel-info" />
	</set-title>
</template>

<script>
import Content from "@components/hr/employee-summary-details/content";

export default {
	name: "oa-hr-employee-summary-details",
	components: {
		"oa-content": Content
	},
};
</script>

<style lang="scss" scoped>
.hr-personnel-info {
  margin-top: -3px;
}
</style>