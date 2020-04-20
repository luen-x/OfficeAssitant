<template>
	<set-title :routes="routes" title="添加需求职位" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter class="g-m-t-15"/>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/personnel-info-demand/list';
import Filter from '@components/hr/personnel-info-demand/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-personnel-info-demand',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_PERSONNEL_INFO_DEMAND')],
	data() {
		const { query = {} } = this.$route;
		
		return {
			routes: [
				{
					path: '/hr/personnel/info?staff_id=' + query.staff_id + '&staff_name=' + query.staff_name + '&from=avatar',
					name: '我的资料',
				},
				{
					path: '',
					name: '添加需求职位'
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
	/deep/ .c-breadcrumb {
		top: 50px;
	}
</style>
