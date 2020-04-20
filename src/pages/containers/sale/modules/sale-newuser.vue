<template>
	<set-title :routes="routes" title="新增客户">
		<oa-new-user/>
	</set-title>
</template>

<script>

import newUser from '@components/sale/newuser/new-user';

export default {
	name: 'oa-sale-newuser',
	components: {
		'oa-new-user': newUser
	},
	data() {
		return {
			routes: [
				{
					path: `/sale/main`,
					name: '我的首页'
				},
				{
					path: `/sale/newuser`,
					name: '新增客户'
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
