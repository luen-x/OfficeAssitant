<template>
	<div>
		<vc-paging
			ref="tableTarget"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			mode="piece"
			class="g-m-t-20 v-hr-academy-statistic-study-detail-list"
			@page-size-change="handleChangePageSize"
		>
			<oa-item 
				slot-scope="it"
				v-bind="it"
				:show="true"
				class="_item"
			/> 
		</vc-paging>
		<div 
			v-if="(Object.keys(listInfo.data).length && !listInfo.data[1].length)"
			class="g-flex g-jc-c g-ai-c"
			style="height:100%"
		>
			<div style="width:416px;margin-top: 60px;">
				<img :src="OSS_SEARCH_EMPTY" >
				<div class="g-tc">暂无数据</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
// item
import Item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'oa-item': Item,
	},
	data() {
		const { query } = this.$route;

		return {
			OSS_SEARCH_EMPTY
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyStatisticStudyDetail.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_STATISTIC_STUDY_DETAIL_LIST_GET',
				// url: '',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_ACADEMY_STATISTIC_STUDY_DETAIL_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-hr-academy-statistic-study-detail-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin: 20px 0;
	._item {
		margin-bottom: 20px;
		width: 100%;
	}
}

</style>
