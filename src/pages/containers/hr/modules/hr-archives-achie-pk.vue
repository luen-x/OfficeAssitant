<template>
	<set-title title="PK情况" style="padding: 20px" class="g-tabs-card">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/archives-achie-pk/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-achie-pk',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_ARCHIVES_ACHIE_PK')],
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
