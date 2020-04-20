<template>
	<div class="g-flex g-jc-c g-m-t-30">
		<oa-circle-info can-collect/>
	</div>
</template>

<script>
import CircleInfo from '@components/content/circle-list-detail/content';

export default {
	name: 'oa-tpl',
	components: {
		'oa-circle-info': CircleInfo
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

<style lang="scss">
</style>
