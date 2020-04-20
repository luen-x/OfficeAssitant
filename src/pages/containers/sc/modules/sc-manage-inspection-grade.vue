<template>
	<set-title 
		:routes="routes" 
		title="打分项设置" 
		class="g-tabs-card"
		style="padding: 20px"
	>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sc/manage-inspection-grade/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-manage-inspection-grade',
	components: {
		"oa-list": List
	},
	mixins: [navigator('SC_MANAGE_INSPECTION_GRADE')],
	data() {
		return {
			routes: [
				{
					path: "",
					name: "打分项设置"
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
</style>