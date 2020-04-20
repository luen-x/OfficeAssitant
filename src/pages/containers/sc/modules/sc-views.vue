<template>
	<set-title 
		:routes="routes" 
		title="OA意见反馈箱" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-filter class="g-m-t-20"/>
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/views/tabs-list';
import Filter from '@components/sc/views/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-views',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SC_VIEWS')],
	data() {
		return {
			routes: [
				{
					path: "",
					name: "OA意见反馈箱"
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
