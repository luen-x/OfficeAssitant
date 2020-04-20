<template>
	<set-title title="社保配置">
		<oa-setting />
	</set-title>
</template>

<script>

import Setting from '@components/hr/salary-social-setting/setting';

export default {
	name: 'oa-hr-salary-social-setting',
	components: {
		'oa-setting': Setting
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
