<template>
	<set-title title="线上学习">
		<study />
	</set-title>
</template>

<script>

import Study from '@components/sale/study-video/study';

export default {
	name: 'oa-sale-study-video',
	components: {
		'study': Study
	},
	data() {
		return {
			routes: [
				{ name: '线上学习' }
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
