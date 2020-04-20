<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<div v-if="$auth[1657]" slot="extra" class="g-tr">
			<vc-debounce-click
				class="g-red-btn-line"
				@click="handleExport"
			>
				导出
			</vc-debounce-click>
		</div>
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label"
			:name="item.value"
		>
			<vc-paging
				:columns="getColumn(item.value)"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-academy-statistics-course-type-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@sort-change="handleSortChange"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from "@extends/mixins/tableHeight";
import API_ROOT from '@stores/apis/root';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane
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
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '战区', value: '1' },
				{ label: '部门', value: '2' }
			],
			sort: {
				apply_sort: null, // 报名人数排序 3-倒序，4正序
				join_sort: null, // 出勤人数排序 3-倒序，4正序
				upload_sort: null // 上传人数排序 3-倒序，4正序
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyStatisticsCourseType.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'ACADEMY_STATISTICS_COURSE_TYPE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					...this.sort,
					course_name: null,
					depart_type: this.type - 1,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/academy/statistics/course/type', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_STATISTICS_COURSE_TYPE_LIST_INIT');
		},
		handleExport() {
			const url = getHashUrl(API_ROOT["ACADEMY_STATISTICS_COURSE_NAME_LIST_GET"], {
				is_export: 1,
				...this.$route.query,
				...this.sort,
				course_name: null,
				depart_type: this.type - 1,
				"-token": this.$global.token
			});

			window.open(url);
		},
		handleSortChange({ key, order }) {
			this.sort = {
				apply_sort: null,
				join_sort: null,
				upload_sort: null,
				all_join_sort: null,
				pass_sort: null,

			};
			if (key == 'all_join_count') {
				this.sort.all_join_sort	= order === 'asc' ? 3 : (order === 'desc' ? 4 : null);
			}
			this.sort[`${key.split("_")[0]}_sort`] = order === 'asc' ? 3 : (order === 'desc' ? 4 : null);

			this.$store.commit('ACADEMY_STATISTICS_COURSE_TYPE_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>