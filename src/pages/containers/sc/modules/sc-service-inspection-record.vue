<template>
	<set-title 
		:routes="routes"
		title="质检记录" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-filter class="g-m-t-20"/>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sc/service-inspection-record/list';
import Filter from '@components/sc/service-inspection-record/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-service-inspection-record',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SC_SERVICE_INSPECTION_RECORD')],
	data() {
		return {
			routes: [
				{
					path: "",
					name: "质检记录"
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
