<template>
	<set-title :routes="route" title="离职邀约">
		<oa-content :type="2" />
	</set-title>
</template>

<script>

import Content from '@components/hr/recruit-talent-invites/content';

export default {
	name: 'oa-hr-recruit-talent-invite-leave',
	components: {
		'oa-content': Content
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/recruit/talent/leave',
					name: '离职人才'
				},
				{
					path: '',
					name: '离职邀约'
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
