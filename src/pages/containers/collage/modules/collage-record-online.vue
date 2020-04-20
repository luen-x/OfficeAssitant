<template>
	<set-title title="线上录单" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/record-online/tabs-list';
import Filter from '@components/collage/record-online/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-record-online',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_RECORD_ONLINE')],
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
