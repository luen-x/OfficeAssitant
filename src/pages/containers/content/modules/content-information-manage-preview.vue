<template>
	<set-title :routes="routes" title="资讯管理" style="padding: 0 20px 20px 20px">
		<oa-new-consulting />
	</set-title>
</template>

<script>

import NewConsulting from '@components/content/information-manage-preview/new-consulting';
import { delItem } from '@utils/utils';

export default {
	name: 'oa-content-information-manage-preview',

	components: {
		'oa-new-consulting': NewConsulting
	},

	data() {
		return {
			routes: []
		};
	},

	beforeRouteEnter(to, from, next) {
		if (from.path != "/content/preview") {
			delItem(`time_${app.$global.version}`);
			delItem(`formValidate_${app.$global.version}`);
		}

		next();
	},

	created() {
		if (this.$route.query.status == "1") {
			this.routes = [
				{ 
					path: `/content/information/manage`,
					name: '资讯管理' 
				},
				{
					path: '',
					name: '新增资讯'
				}
			];
		} else {
			this.routes = [
				{ 
					path: `/content/information/manage`,
					name: '资讯管理' 
				},
				{
					path: '',
					name: '编辑资讯'
				}
			];
		}
	},
	
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
