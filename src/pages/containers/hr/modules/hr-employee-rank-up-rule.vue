<template>
	<set-title
		:routes="routes"
		title="晋升规则"
		class="g-tabs-card">
		<oa-content ref="info" />
	</set-title>
</template>

<script>

import Content from '@components/hr/employee-rank-up-rule/content';
import { DelTipModal } from '../../../components/hr/_common/delete-tip';

export default {
	name: 'oa-hr-employee-rank-up-rule',
	components: {
		'oa-content': Content
	},
	beforeRouteLeave(to, from, next) {
		if (this.$refs.info.handleIsChanged()) {
			next();
		} else {
			DelTipModal.popup({
				title: '提示',
				content: '规则已改变，请点击保存！'
			}).then(res => {
			}).catch(err => {});
		}
	},

	data() {
		const { query } = this.$route;
		return {
			routes: [
				{
					path: `/hr/employee/rank/up`,
					name: '晋升体系'
				},
				{
					path: '',
					name: `晋升规则-${query.depart_name}`
				}
			]
		};
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
