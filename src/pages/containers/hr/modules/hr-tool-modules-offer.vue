<template>
	<set-title title="常用模板" class="g-pd-20">
		<oa-filter />
		<oa-modules />
	</set-title>
</template>

<script>

import Filter from '@components/hr/tool-modules-offer/filter';
import Modules from '@components/hr/tool-modules-offer/modules';

export default {
	name: 'oa-hr-tool-modules-offer',
	components: {
		'oa-filter': Filter,
		'oa-modules': Modules,
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
