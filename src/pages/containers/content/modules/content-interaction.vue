<template>
	<set-title title="互动大屏">
		<oa-interaction-left />
	</set-title>
</template>

<script>

import leftContent from '@components/content/interaction/left-content';

export default {
	name: 'oa-content-interaction',
	components: {
		'oa-interaction-left': leftContent
	},
	data() {
		return {
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
