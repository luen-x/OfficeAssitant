<template>
	<set-title :routes="routes" title="优劣势互荐">
		<oa-personnel-info-recommend />
	</set-title>
</template>

<script>

import HrPersonnelInfoRecommend from '@components/hr/personnel-info-recommend';

export default {
	name: 'oa-hr-personnel-info-recommend',
	components: {
		'oa-personnel-info-recommend': HrPersonnelInfoRecommend
	},
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
					name: '优劣势互荐'
				}
			]
		};
	},
	mounted() {
		if (this.$auth[1225] && this.$auth[1231]) {
			document.getElementsByClassName('c-breadcrumb')[0].style.top = 50 + 'px';
		} else {
			document.getElementsByClassName('c-breadcrumb')[0].style.top = 0 + 'px';
		}
	}
};
</script>

<style lang="scss" scoped>
	
</style>
