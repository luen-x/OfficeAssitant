<template>
	<set-title
		:routes="routes" 
		class="v-academy-train-detail-all"
	>
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/academy-train-detail/content';
import API_ROOT from "@stores/apis/root";

export default {
	name: 'oa-hr-academy-train-detail',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				// {
				// 	path: `/hr/academy/train/arrangement`,
				// 	name: '培训安排'
				// },
				{
					path: '/hr/academy/train/arrangement',
					name: '培训安排-'
				}
			]
		};
	},
	created() {
		this.loadDetailData();
	},
	methods: {
		loadDetailData() {
			return this.$request({
				url: API_ROOT['_HR_ACADEMY_TRAIN_DETAIL_BASIC_0_INFO_LIST_GET'],
				type: 'GET',
				param: {
					project_id: this.$route.query.project_id,
				},
			}).then((res) => {
				this.routes = [{
					path: '/hr/academy/train/arrangement',
					name: '培训安排-' + res.data.project_topic
				}];
			}).catch((error) => {
				console.error(error);
			});
		},
	},
};
</script>

<style lang="scss">
.v-academy-train-detail-all {
	.c-breadcrumb {
		span {
			cursor: pointer;
		}
		span:hover {
			color: #5DB1F8 !important;
		}
	}
}
</style>
