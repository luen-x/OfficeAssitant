<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		mode="table"
		class="g-m-t-20 v-hr-academy-train-detail-draw-1-result-list"
		@page-size-change="handleChangePageSize"
		@sort-change="handleSortChange"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyTrainDetailDraw1Result.listInfo;
		}
	},
	created() {
		this.loadHeaderData();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				// console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_LIST_INIT');
		},
		loadHeaderData() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_HEADER_GET,
				param: { lottery_id: this.$route.query.lottery_id },
				type: "GET"
			}).then(res => {
				this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_HEADER', res.data);
			}).catch(err => {
				
			});
		},
		handleSortChange({ order }) {
			this.$router.replace({
				path: '/hr/academy/train/detail/draw/1/result',
				query: {
					...this.$route.query,
					sort_create_time: order === 'asc' ? 1 : 2
				}
			});
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-hr-academy-train-detail-draw-1-result-list {
	.__footer {
		width: calc(100% - 340px) !important;
	}
}
</style>
