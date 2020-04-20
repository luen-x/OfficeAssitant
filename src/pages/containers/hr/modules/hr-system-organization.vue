<template>
	<set-title title="组织架构" class="v-hr-organization" style="padding: 20px">
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/organization/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-organization',
	components: {
		"oa-list": List,
	},
	mixins: [navigator('HR_ORGANIZATION')],
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
.v-hr-organization {
	.vc-paging {
		// 处理滚动条问题
		margin-bottom: 0px !important;
	}
}
</style>
