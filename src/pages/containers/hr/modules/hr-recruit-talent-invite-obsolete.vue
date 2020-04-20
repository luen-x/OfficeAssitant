<template>
	<set-title :routes="route" title="淘汰邀约">
		<oa-content :type="1" />
	</set-title>
</template>

<script>

import Content from '@components/hr/recruit-talent-invites/content';

export default {
	name: 'oa-hr-recruit-talent-invite-obsolete',
	components: {
		'oa-content': Content
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/recruit/talent/obsolete',
					name: '淘汰人才'
				},
				{
					path: '',
					name: '淘汰邀约'
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
