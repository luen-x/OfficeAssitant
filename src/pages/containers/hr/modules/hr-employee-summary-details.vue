<template>
	<set-title 
		title="个人资料" 
		style="padding: 20px,overflow-x: auto">
		<oa-content class="v-hr-fa-details" />
	</set-title>
</template>

<script>
import Content from "@components/hr/employee-summary-details/content";
import { enCode, unCode } from '@utils/utils';

export default {
	name: "oa-hr-employee-summary-details",
	components: {
		"oa-content": Content
	},
	beforeRouteEnter(to, from, next) {
		if (to.query.staff_id && !String(to.query.staff_id).endsWith('_code')) {
			next({
				path: to.path,
				query: {
					...to.query,
					staff_id: enCode(to.query.staff_id)
				} });
		} else next();
	},
	beforeRouteUpdate(to, from, next) {
		if (to.query.staff_id && !String(to.query.staff_id).endsWith('_code')) {
			next({
				path: to.path,
				query: {
					...to.query,
					staff_id: enCode(to.query.staff_id)
				} });
		} else next();

	}
};
</script>

<style lang="scss" scoped>
.v-hr-fa-details {
  margin-top: -3px;
}
</style>
