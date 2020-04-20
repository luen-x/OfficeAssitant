<template>
	<set-title title="趋势分析" style="padding: 20px">
		<oa-zone />
		<oa-depart />
		<oa-staff />
	</set-title>
</template>

<script>
import Staff from '@components/hr/archives-achie-trend/staff';
import Depart from '@components/hr/archives-achie-trend/depart';
import Zone from '@components/hr/archives-achie-trend/zone';

export default {
	name: 'oa-hr-archives-achie-trend',
	components: {
		'oa-zone': Zone,
		'oa-depart': Depart,
		'oa-staff': Staff
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
