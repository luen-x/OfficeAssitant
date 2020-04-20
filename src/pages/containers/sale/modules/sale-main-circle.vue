<template>
	<set-title :routes="routes" title="发圈素材" class="g-tabs-card" style="padding: 20px">
		<div class="g-flex g-jc-c" style="min-width:1000px">
			<div style="width:1000px">
				<oa-filter />
				<oa-list />
			</div>
		</div>
	</set-title>
	<!-- <set-title title="sale-main-circle" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title> -->
</template>

<script>
import List from '@components/sale/main-circle/list';
import Filter from '@components/sale/main-circle/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-main-circle',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_MAIN_CIRCLE')],
	data() {
		return {
			routes: [
				{
					path: `/sale/main`,
					name: '首页'
				},
				{
					path: '',
					name: '发圈素材'
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
