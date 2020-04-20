<template>
	<div class="g-flex g-jc-c g-pd-t-20" style="height:inherit" >
		<oa-info :case-id="caseId"/>
		<!-- <oa-hot-case/> -->
	</div>
</template>

<script>
import Info from './info';
import HotCase from './hot-case';

export default {
	name: 'oa-tpl',
	components: {
		'oa-info': Info,
		'oa-hot-case': HotCase
	},
	data() {
		return {
			caseId: this.$route.query.case_id
		};
	},
	created() {
		// this.loadCaseDetail();
	},
	methods: {
		
	},
};
</script>

<style lang="scss" scoped>
</style>
