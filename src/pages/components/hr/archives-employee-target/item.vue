<template>
	<div :key="id">
		<div>{{ name }}</div>
		<div @click="handleResetFirst">回到首页刷新</div>
		<div @click="handleResetCur">当前页刷新</div>
	</div>
</template>

<script>
export default {
	name: "oa-item",
	props: {
		id: [String, Number],
		name: String
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_TARGET_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_TARGET_LIST_RESET', { type: this.type });
		}
	}
};
</script>
