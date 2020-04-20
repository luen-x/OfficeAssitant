<template>
	<set-title title="组织人员" style="padding: 20px" class="v-hr-recruit-school-organization">
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/recruit-school-organization/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-organization',
	components: {
		"oa-list": List
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_ORGANIZATION')],
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
.v-hr-recruit-school-organization {
	.vc-paging {
		// 处理滚动条问题
		margin-bottom: 0px !important;
	}
}
</style>
