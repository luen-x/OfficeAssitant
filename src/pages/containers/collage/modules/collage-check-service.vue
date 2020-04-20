<template>
	<set-title title="服务质检" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/check-service/tabs-list';
import Filter from '@components/collage/check-service/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-check-service',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_CHECK_SERVICE')],
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
