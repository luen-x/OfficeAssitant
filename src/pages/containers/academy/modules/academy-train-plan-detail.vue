<template>
	<set-title :routes="routes" title="培训详情">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/academy/train-plan-detail/content';
import API_ROOT from "@stores/apis/root";

export default {
	name: 'oa-academy-train-plan-detail',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: []
		};
	},
	created() {
		this.loadDetailData();
	},
	methods: {
		loadDetailData() {
			return this.$request({
				url: API_ROOT['_ACADEMY_TRAIN_PLAN_DETAIL_SIGN_DETAIL_GET'],
				type: 'GET',
				param: {
					course_id: this.$route.query.course_id,
				},
			}).then((res) => {
				this.routes = [
					{
						path: '/academy/train/plan',
						name: '培训列表'
					},
					{
						path: '',
						name: res.data.course_name
					}];
			}).catch((error) => {
				console.error(error);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
