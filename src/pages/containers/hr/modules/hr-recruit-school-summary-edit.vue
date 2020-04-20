<template>
	<set-title :routes="routes" title="批量编辑" class="g-pd-20">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/recruit-school-summary-edit/content';

export default {
	name: 'oa-hr-recruit-school-summary-edit',
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
					name: '批量编辑'
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
