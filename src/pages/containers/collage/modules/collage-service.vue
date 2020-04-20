<template>
	<set-title title="客户服务" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/service/tabs-list';
import Filter from '@components/collage/service/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-service',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_SERVICE')],
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
