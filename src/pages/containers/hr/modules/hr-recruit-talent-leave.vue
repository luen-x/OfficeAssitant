<template>
	<set-title title="离职人才" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter /> 
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-talent-leave/tabs-list';
import Filter from '@components/hr/recruit-talent-leave/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-talent-leave',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_TALENT_LEAVE')],
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
