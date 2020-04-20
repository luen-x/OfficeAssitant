<template>
	<div class="g-m-t-20">
		<div class="g-tr">
			<vc-debounce-click
				class="g-red-btn-line"
				@click="handleExport"
			>
				导出
			</vc-debounce-click>
		</div>

		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight}"
			mode="table"
			class="g-m-t-20 v-academy-statistics-course-name-list"
			@page-size-change="handleChangePageSize"
			@sort-change="handleSortChange"
		/>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { tableHeight } from "@extends/mixins/tableHeight";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true
		})
	],
	data() {
		const { query } = this.$route;

		return {
			sort: {
				apply_sort: null, // 报名人数排序 3-倒序，4正序
				join_sort: null, // 出勤人数排序 3-倒序，4正序
				upload_sort: null // 上传人数排序 3-倒序，4正序
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyStatisticsCourseName.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'ACADEMY_STATISTICS_COURSE_NAME_LIST_GET',
				type: 'GET',
				param: {
					...query,
					course_name: null,
					page,
					pageSize,
					...this.sort
				},
			}).then(res => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_STATISTICS_COURSE_NAME_LIST_INIT');
		},
		handleExport() {
			const url = getHashUrl(API_ROOT["ACADEMY_STATISTICS_COURSE_NAME_LIST_GET"], {
				is_export: 1,
				...this.$route.query,
				...this.sort,
				"-token": this.$global.token
			});

			window.open(url);
		},
		handleSortChange({ key, order }) {
			this.sort = {
				apply_sort: null,
				join_sort: null, 
				upload_sort: null
			};

			this.sort[`${key.split("_")[0]}_sort`] = order === 'asc' ? 3 : (order === 'desc' ? 4 : null);

			this.$store.commit('ACADEMY_STATISTICS_COURSE_NAME_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>