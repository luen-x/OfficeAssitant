<template>
	<set-title 
		:routes="routes" 
		title="发件箱"  
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-filter class="g-m-t-20"/>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sc/customer-cooperate-outbox/list';
import Filter from '@components/sc/customer-cooperate-outbox/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-customer-cooperate-outbox',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SC_CUSTOMER_COOPERATE_OUTBOX')],
	data() {
		return {
			routes: [
				{
					path: "",
					name: "发件箱"
				}
			]
		};
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
