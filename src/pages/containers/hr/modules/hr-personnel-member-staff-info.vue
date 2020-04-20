<template>
	<set-title 
		title="下级员工资料" 
		style="padding: 20px,overflow-x: auto">
		<oa-content class="v-hr-fa-details" />
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
.v-hr-fa-details {
  margin-top: -3px;
}
</style>
