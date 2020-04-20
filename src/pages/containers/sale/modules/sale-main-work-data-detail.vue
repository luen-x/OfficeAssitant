<template>
	<set-title :routes="routes" title="员工数据" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/main-work-data-detail/tabs-list';
import Filter from '@components/sale/main-work-data-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-main-work-data-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_MAIN_WORK_DATA_DETAIL')],
	data() {
		return {
			routes: [
				{ name: '首页', path: "/sale/main" }, 
				{ name: '工作数据', path: "/sale/main/work/data" },
				{ name: this.$route.query.staff_name || '员工数据', path: '' }
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
