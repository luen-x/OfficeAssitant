<template>
	<set-title
		:routes="routes"
		title="识别简历"
		style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/recruit-social-identify/content';

export default {
	name: 'oa-hr-recruit-social-identify',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/social/summary',
					name: '社招跟进'
				},
				{
					path: '',
					name: '识别简历'
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
