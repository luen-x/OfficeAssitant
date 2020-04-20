<template>
	<set-title title="资讯管理" style="padding: 20px">
		<oa-filter/>
		<oa-list /> 
	</set-title>
</template>

<script>
import List from '@components/content/information-manage/list';
import Filter from '@components/content/information-manage/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-information-manage',
	components: {
		"oa-list": List,
		"oa-filter": Filter
	},
	mixins: [navigator('CONTENT_INFORMATION_MANAGE')],
	data() {
		return {
			show: true
		};
	},
	mounted() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
</style>
