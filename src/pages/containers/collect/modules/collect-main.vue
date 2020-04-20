<template>
	<set-title title="我的收藏" class="g-tabs-card" style="padding: 20px">
		<div class="g-flex g-jc-c g-relative" style="min-width:1000px">
			<div style="width:1000px;">
				<oa-filter />
				<oa-list />
			</div>

		</div>
		
	</set-title>
</template>

<script>
import List from '@components/collect/main/list';
import Filter from '@components/collect/main/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collect-main',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLECT_MAIN')],
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
