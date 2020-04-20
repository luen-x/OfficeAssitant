<template>
	<set-title :routes="routes" title="做服务">
		<oa-service-do />
	</set-title>
</template>

<script>
import ServiceDo from '@components/sale/_common/service/do';

export default {
	name: 'oa-sale-service-do',
	components: {
		"oa-service-do": ServiceDo
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: '做服务'
				}
			]
		};
	},
};
</script>

<style lang="scss" scoped>
</style>
