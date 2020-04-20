<template>
	<set-title 
		:routes="routes"
		title="导出任务" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-list /> 
	</set-title>
</template>

<script>
import List from '@components/sc/customer-cooperate-exporttask/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-customer-cooperate-exporttask',
	components: {
		"oa-list": List,
	},
	mixins: [navigator('SC_CUSTOMER_COOPERATE_EXPORTTASK')],
	data() {
		return {
			routes: [
				{
					path: "/sc/customer/cooperate",
					name: "客户合同"
				},
				{
					path: "",
					name: "导出任务"
				}
			]
		};
	},
	created() {
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
</style>
