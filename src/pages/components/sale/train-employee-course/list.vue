<template>
	<div>
		<div 
			v-if="loading" 
			class="g-flex g-jc-c g-ai-fs"
			style="margin-top:60px;"
		>
			<i-spin size="large" />
		</div>
		<div
			v-if="!loading && !listInfo.total"
			class="g-tc"
			style="margin-top:60px;"
		>
			<div>
				<img :src="OSS_SEARCH_EMPTY" >
				<div class="g-tc">暂无数据</div>
			</div>
		</div>
		<vc-paging
			ref="tableTarget"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			mode="piece"
			class="g-m-t-20 g-pd-b-20 v-sale-train-employee-course-list"
			@page-size-change="handleChangePageSize"
		>
			<oa-item 
				slot-scope="it"
				v-bind="it"
				class="_item"
			/> 
		</vc-paging>
	</div>
</template>

<script>
import { Paging, Spin } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
// item
import Item from './item';

export default {
	name: 'oa-train-employee-course-list',
	components: {
		'vc-paging': Paging,
		'i-spin': Spin,
		'oa-item': Item,
	},
	data() {
		const { query } = this.$route;

		return {
			loading: false,
			OSS_SEARCH_EMPTY
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleTrainEmployeeCourse.listInfo;
		}
	},
	methods: {
		loadData(page = 1, pageSize = 10) {
			this.loading = true;
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_TRAIN_EMPLOYEE_COURSE_LIST_GET',
				type: 'GET',
				initList: (list) => list.map((row, index) => ({ ...row, subjectIndex: index + (+page - 1) * +pageSize + 1 })),
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				this.loading = false;
			}).catch((error) => {
				this.loading = false;
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_TRAIN_EMPLOYEE_COURSE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-sale-train-employee-course-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin: 20px 0;
	._item {
		width: calc(100%);
		margin-bottom: 10px;
	}
}

</style>
