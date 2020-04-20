<template>
	<set-title :routes="routes" title="添加资料" class="g-tabs-card g-pd-lr-20">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/sale/customer-intention-add/index';

export default {
	name: 'oa-sale-customer-intention-add',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [{ name: '添加资料', path: '' }]
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
