<template>
	<set-title :routes="routes" title="在售商品">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/full-goods';

export default {
	name: 'oa-sale-full-goods',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: []
		};
	},
	created() {
		let path = "";
		let name = "";

		if (this.$route.query.flags == 1 && this.$route.query.status == 3) {
			path = "/content/customer";
			name = "客户案例";
		} else if (this.$route.query.flags == 1 && this.$route.query.status == 6) {
			path = "/sale";
			name = "我的首页";
		} else {
			path = `/content/search/result?keyword=${this.$route.query.key}&type=${this.$route.query.type}`;
			name = "全局搜索";
		}

		this.routes = [
			{
				path,
				name
			},
			{
				path: '',
				name: '在售商品'
			}
		];
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
