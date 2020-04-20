<template>
	<set-title
		:routes="routes"
		title="新人输送-查看详情">
		<oa-school-content v-if="isSchool" />
		<oa-social-content v-else />
	</set-title>
</template>

<script>

import schoolContent from '@components/hr/recruit-school-summary-detail/content';
import Info from '@components/hr/recruit-social-details/info';

export default {
	name: 'oa-hr-academy-transfer-detail',
	components: {
		'oa-school-content': schoolContent,
		'oa-social-content': Info
	},
	data() {
		let params = this.$route.params || {};
		let query = this.$route.query || {};
		let path = '';
		switch (query.index) {
			case 'try':
				path = '/hr/academy/transfer/statistic?type=try';
				break;
			case 'teacher':
				path = '/hr/academy/transfer/statistic?type=teacher';
				break;
			default:
				path = '/hr/academy/transfer/transfer';
				break;
		}

		return {
			isSchool: params.type === 'school',
			routes: [
				{
					path,
					name: `${query.index === 'transfer' ? '新人输送' : '数据统计'}`
				},
				{
					path: '',
					name: '查看详情'
				}
			]
		};
	},
	watch: {
		'$route.params.type': {
			handler(val) {
				this.isSchool = val === 'school';
			}
		}
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
