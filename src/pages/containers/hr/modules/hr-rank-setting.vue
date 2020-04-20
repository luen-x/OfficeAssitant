<template>
	<set-title :routes="routes" :title="title">
		<oa-setting />
	</set-title>
</template>

<script>

import Setting from '@components/hr/rank-setting/setting';

export default {
	name: 'oa-hr-rank-setting',
	components: {
		'oa-setting': Setting
	},
	data() {
		let title = this.$route.query.type == 1 ? '晋级设置' : '称号设置';
		return {
			title,
			routes: [
				{
					path: '/hr/system/assess/rank',
					name: title
				},
				{
					path: '',
					name: this.$route.query.depart_name
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
