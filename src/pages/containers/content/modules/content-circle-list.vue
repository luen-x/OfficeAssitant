<template>
	<set-title title="发圈素材管理" class="g-tabs-card" style="padding: 20px">
		<div class="g-flex g-jc-c" style="min-width:1000px">
			<div style="width:1000px">
				<oa-filter />
				<oa-list />
			</div>
		</div>
	</set-title>
</template>

<script>
import List from '@components/content/circle-list/list';
import Filter from '@components/content/circle-list/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-circle-list',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_CIRCLE_LIST')],
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
