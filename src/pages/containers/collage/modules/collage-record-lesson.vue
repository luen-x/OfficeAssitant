<template>
	<set-title title="大课录单" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/record-lesson/tabs-list';
import Filter from '@components/collage/record-lesson/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-record-lesson',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_RECORD_LESSON')],
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
