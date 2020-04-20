<template>
	<set-title title="我的申请" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/administration/application-mine/tabs-list';
import Filter from '@components/administration/application-mine/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-administration-application-mine',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ADMINISTRATION_APPLICATION_MINE')],
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
