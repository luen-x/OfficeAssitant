<template>
	<set-title 
		:routes="routes" 
		title="查看人员档案" 
		class="g-tabs-card" 
		style="padding: 20px" 
	>
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/archives-person-details/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-person-details',
	components: {
		"oa-tabs-list": TabsList,
	},
	// mixins: [navigator('HR_ARCHIVES_PERSON')],
	data() {
		return {
			routes: [
				{
					path: `/hr/archives/person`,
					name: '人员档案'
				},
				{
					path: '',
					name: '查看'
				}
			]
		};
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss">

</style>
