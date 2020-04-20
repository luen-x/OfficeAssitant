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
import List from '@components/collage/check-service-export/list';
import Filter from '@components/collage/check-service-export/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-check-service-export',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_CHECK_SERVICE_EXPORT')],
	data() {
		return {
			routes: [
				{
					path: "/collage/check/service",
					name: "质检管理"
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
	},
};
</script>

<style lang="scss" scoped>
</style>
