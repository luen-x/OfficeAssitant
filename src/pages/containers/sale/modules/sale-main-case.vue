<template>
	<set-title :routes="routes" title="更多案例" class="g-tabs-card" style="padding: 20px">
		<div class="g-flex g-jc-c" style="min-width:1000px">
			<div style="width:1000px">
				<!-- <oa-filter /> -->
				<oa-list />
			</div>
		</div>
	</set-title>
</template>

<script>
import List from '@components/sale/main-case/list';
import Filter from '@components/sale/main-case/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-main-case',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_MAIN_CASE')],
	data() {
		return {
			routes: [
				{
					path: `/sale/main`,
					name: '首页'
				},
				{
					path: '',
					name: '更多案例'
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
