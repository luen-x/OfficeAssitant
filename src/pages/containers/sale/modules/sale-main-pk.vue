<template>
	<set-title title="我的PK">
		<oa-main-pk />
	</set-title>
</template>

<script>

import saleMainPk from '@components/sale/main-pk/content';

export default {
	name: 'oa-sale-main-pk',
	components: {
		'oa-main-pk': saleMainPk
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
