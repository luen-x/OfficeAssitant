<template>
	<div class="g-flex g-jc-c g-pd-t-20" style="height:inherit" >
		<oa-case-info :case-id="caseId" :show-collect="!!$auth[1765]" class="g-m-l-20"/>
		<div v-if="relateCase.length" class="g-m-l-20">
			<oa-hot-case :case-list="relateCase" title="相关案例" @click-case="handleClickCase"/>
		</div>
	</div>
</template>
<script>
import CaseInfo from '@components/academy/support-case-detail/info';
import HotCase from '@components/academy/support-case-detail/hot-case';

export default {
	name: 'oa-sale-main-case-detail',
	components: {
		'oa-hot-case': HotCase,
		'oa-case-info': CaseInfo
	},
	data() {
		return {
			caseId: +this.$route.query.case_id,
			relateCase: [],
		};
	},
	created() {
		this.loadRelateCase();
	},
	methods: {
		loadRelateCase() {
			this.$request({
				url: "_SALE_CUSTOMER_MAIN_RELATE_CASE_GET",
				type: "GET",
				param: { case_id: this.caseId },
				loading: false,
			}).then(res => {
				res.data.forEach(item => {
					item.hot = item.collection_num > 10;
				});
				this.relateCase = res.data;
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleClickCase(ca) {
			this.$router.replace({
				path: '',
				query: { case_id: ca.case_id }
			});
			this.caseId = ca.case_id;
			this.loadRelateCase();
		}

	},
};
</script>

<style lang="scss">
</style>
