<template>
	<set-title :routes="routes" title="考试审核" class="g-tabs-card g-of-h" style="padding: 20px;">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-train-arrangement-audit/tabs-list';
import Filter from '@components/hr/academy-train-arrangement-audit/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-arrangement-audit',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT')],
	data() {
		return {
			routes: [{ name: '考试审核列表', path: '' }]
		};
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
.__test {
	color: red
}
</style>
