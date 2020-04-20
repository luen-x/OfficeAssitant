<template>
	<div class="g-flex g-jc-c g-m-t-30">
		<oa-case-info v-if="$route.query.case_id" :case-id="+$route.query.case_id" :show-collect="!$route.query.is_self"/>
		<oa-circle-info v-if="$route.query.circle_id" can-collect/>
	</div>
</template>

<script>
import Info from '@components/academy/support-case-detail/info';
import CircleInfo from '@components/content/circle-list-detail/content';

export default {
	name: 'oa-tpl',
	components: {
		'oa-case-info': Info,
		'oa-circle-info': CircleInfo
	},
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
</style>
