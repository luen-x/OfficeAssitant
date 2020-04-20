<template>
	<set-title :routes="routes" class="g-tabs-card" title="工作数据" style="padding: 20px;min-width:1000px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/main-work-data/list';
import Filter from '@components/sale/main-work-data/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-main-work-data',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_MAIN_WORK_DATA')],
	data() {
		return {
			routes: [
				{
					path: '/sale/main',
					name: '我的首页'
				},
				{
					path: '',
					name: '工作数据'
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
