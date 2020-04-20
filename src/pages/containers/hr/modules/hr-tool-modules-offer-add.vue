<template>
	<set-title title="新增模板">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/tool-modules-offer-add/content';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-tool-modules-offer-add',
	components: {
		'oa-content': Content
	},
	mixins: [navigator('HR_TOOL_MODULES_OFFER_ADD')],
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
