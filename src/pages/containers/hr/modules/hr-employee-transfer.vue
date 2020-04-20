<template>
	<set-title title="离职流程">
		<oa-transfer />
	</set-title>
</template>

<script>

import Transfer from '@components/hr/employee-transfer/transfer';

export default {
	name: 'oa-hr-employee-transfer',
	components: {
		'oa-transfer': Transfer
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
