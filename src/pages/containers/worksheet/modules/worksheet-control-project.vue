<template>
	<set-title 
		title="项目管理" 
		class="g-tabs-card g-hide-scroll v-worksheet-control-project-container" 
		style="padding: 20px"
	>
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/worksheet/control-project/tabs-list';
import Filter from '@components/worksheet/control-project/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-worksheet-control-project',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('WORKSHEET_CONTROL_PROJECT')],
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

<style lang="scss">
.v-worksheet-control-project-container {
	.vc-paging .__footer {
		width: 100% !important;
	}
}
</style>
