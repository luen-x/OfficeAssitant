<template>
	<set-title :routes="routes" title="校招总表-详情">
		<oa-content ref="detail" @handleActionChange="handleNameChange"/>
	</set-title>
</template>

<script>

import Content from '@components/hr/recruit-school-summary-detail/content';

export default {
	name: 'oa-hr-recruit-school-summary-detail',
	components: {
		'oa-content': Content
	},
	data() {
		let params = this.$route.params || {};
		let name = '';
		let path = '';
		switch (params.type) {
			case 'summary':
				name = '校招总表';
				break;
			case 'statistics':
				name = '校招统计';
				break;
			case 'tryassign':
				name = '试岗分配';
				break;
			case 'war':
			case 'depart':
				name = '分配情况';
				path = '/hr/recruit/school/assigndetails';
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
			default:
				name = '校招总表';
				path = '';
				break;
		}

		return {
			routes: [
				{
					path: `${path || `/hr/recruit/school/${params.type}`}`,
					name: `${name}`
				},
				{
					path: '',
					name: '查看详情'
				}
			]
		};
	},
	methods: {
		handleNameChange() {
			this.routes[1].name = this.$refs.detail.action === 'watch' ? '查看详情' : '编辑详情';
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
