<template>
	<set-title :routes="routes" title="社招跟进-编辑详情">
		<oa-info ref="detail" :toggle="handleToggle" />
	</set-title>
</template>

<script>

import Info from '@components/hr/recruit-social-details/info';

export default {
	name: 'oa-hr-recruit-social-details',
	components: {
		'oa-info': Info
	},
	data() {
		let params = this.$route.params || {};
		let name = '';
		let path = '';
		const { query } = this.$route;
		switch (params.type) {
			case 'summary':
				name = '社招跟进';
				break;
			case 'obsolete':
				name = '淘汰人才';
				path = '/hr/recruit/talent/obsolete';
				break;
			case 'leave':
				name = '离职人才';
				path = '/hr/recruit/talent/leave';
				break;
			case 'statistics':
				name = '社招跟进';
				break;
			case 'transfer':
				name = '新人输送';
				path = '/hr/academy/transfer/transfer';
				break;
			case 'try':
			case 'loss':
			case 'teacher':
			case 'demand':
				name = '数据统计';
				path = '/hr/academy/transfer/statistic';
				break;
			case 'social-statistics':
				name = '社招统计表';
				path = '/hr/recruit/social/statistics?type=social-statistics';
				break;
			case 'social-follow':
				name = '社招跟进';
				path = '/hr/recruit/social/statistics?type=social-follow';
				break;
			default:
				name = '社招跟进';
				break;
		}
		return {
			routes: [
				{
					path: `${path || `/hr/recruit/social/${params.type}`}`,
					name: `${name}`
				},
				{
					path: '',
					// name: params.type === 'summary' ? '编辑详情' : '查看详情'
					name: '查看详情'
				}
			]
		};
	},
	created() {
	},
	methods: {
		handleToggle(status) {
			this.routes[1].name = status === 'look' ? '查看详情' : '编辑详情';
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
