<template>
	<set-title title="待我审核" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/administration/application-wait/tabs-list';
import Filter from '@components/administration/application-wait/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-administration-application-wait',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ADMINISTRATION_APPLICATION_WAIT')],
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
