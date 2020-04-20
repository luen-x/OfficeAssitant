<template>
	<set-title :routes="routes" title="校招总表-预览">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/recruit-school-summary-offer/content';

export default {
	name: 'oa-hr-recruit-school-summary-offer',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/school/summary',
					name: '校招总表'
				},
				{
					path: '',
					name: '发offer'
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
