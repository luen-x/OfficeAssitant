<template>
	<set-title :routes="routes" title="预览" style="padding: 0 20px 20px 20px">
		<oa-preview />
	</set-title>
</template>

<script>

import Preview from '@components/content/preview/preview';
import { delItem } from '@utils/utils';

export default {
	name: 'oa-content-preview',

	components: {
		'oa-preview': Preview
	},

	data() {
		return {
			arr: ["/content/information/manage/preview"],
			routes: []
		};
	},

	beforeRouteLeave(to, from, next) {
		if (this.arr.indexOf(to.path) == -1) {
			delItem(`time_${app.$global.version}`);
			delItem(`form_${app.$global.version}`);
		}

		next();
	},

	created() {
		if (+this.$route.query.status === 1) {
			this.routes = [
				{
					path: '/content/information/manage',
					name: '资讯管理'
				},
				{
					path: '',
					name: '资讯预览'
				}
			];
		} else if (+this.$route.query.status === 2) {
			this.routes = [
				{
					path: `/content/search/result?
						keyword=${this.$route.query.key}&type=${this.$route.query.type}`,
					name: '全局搜索'
				},
				{
					path: '',
					name: '资讯预览'
				}
			];
		} else if (+this.$route.query.status === 5) {
			this.routes = [
				{
					path: '/sale/main',
					name: '我的首页'
				},
				{
					path: '',
					name: '资讯详情'
				}
			];
		}
	}
};
</script>

<style lang="scss" scoped>
</style>