<template>
	<set-title :routes="routes" title="Offer模板">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/tool-modules-edit/content';

export default {
	name: 'oa-hr-tool-modules-edit',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '/hr/tool/modules/upload',
					name: 'Offer正文'
				},
				{
					path: '',
					name: this.$route.query.recruitType === 'school' ? '校招Offer正文模版' : '社招Offer正文模版'
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
