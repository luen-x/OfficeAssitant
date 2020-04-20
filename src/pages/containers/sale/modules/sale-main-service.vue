<template>
	<set-title :routes="routes" title="服务质检" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/main-service/tabs-list';
import Filter from '@components/sale/main-service/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-main-service',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_MAIN_SERVICE')],
	data() {
		return {
			routes: [
				{
					path: `/sale/main`,
					name: '首页'
				},
				{
					path: '',
					name: '服务质检'
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
