<template>
	<set-title title="分配情况" style="padding: 20px" class="v-hr-recruit-school-assigndetails">
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/recruit-school-assigndetails/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-assigndetails',
	components: {
		"oa-list": List
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_ASSIGNDETAILS')],
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
.v-hr-recruit-school-assigndetails {
	// .v-hr-recruit-school-assigndetails-list {
		.vc-paging {
			// 处理滚动条问题
			margin-bottom: 0px !important;
		}
	// }
}
</style>
