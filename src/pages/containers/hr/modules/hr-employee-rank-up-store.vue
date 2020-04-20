<template>
	<set-title
		:routes="routes"
		title="规则库">
		<oa-content />
	</set-title>
</template>

<script>
import { getHashUrl } from '@utils/utils';
import Content from '@components/hr/employee-rank-up-store/content';

export default {
	name: 'oa-hr-employee-rank-up-store',
	components: {
		'oa-content': Content
	},
	data() {
		const { query } = this.$route;
		return {
			routes: [
				{
					path: getHashUrl(`/hr/employee/rank/up/rule`, { depart_name: query.depart_name, depart_id: query.depart_id }),
					name: `晋升体系-${query.depart_name}`
				},
				{
					path: '',
					name: '规则库'
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
