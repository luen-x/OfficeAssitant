<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<div v-if="tabs.length">
			<i-tab-pane 
				v-for="(item, i) in tabs"
				:key="item.value"
				:label="item.label + tabNums[i]" 
				:name="item.value"
			>
				<vc-paging
					:columns="getColumns(item.value)"
					:show="item.value == type" 
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					class="v-hr-academy-train-detail-exam-6-result-list"
					mode="table"
					@page-size-change="handleChangePageSize"
					@sort-change="handleSortChange"
				/>
			</i-tab-pane>
		</div>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import API_ROOT from '@stores/apis/root';
import { autoFix } from '@extends/mixins/auto-fix';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, autoFix()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabNums: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		};
	},
	computed: {
		tabs() {
			return this.$store.state.hrAcademyTrainDetailPaper3Result.tabs;
		},
		listInfo() {
			return this.$store.state.hrAcademyTrainDetailPaper3Result.listInfo;
		}
	},
	created() {
		
	},
	beforeDestroy() {
		this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_TABS_INIT');
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.handleTabNum(res.data);
				this.resetType('1', this.tabNums, '/hr/academy/train/detail/paper/3/result');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			delete query.sort_key;
			delete query.sort_value;
			this.$router.replace(getHashUrl('/hr/academy/train/detail/paper/3/result', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_INIT');
		},
		handleSortChange({ column, key, order }) {
			let sort = {
				sort_key: key,
				sort_value: order === 'asc' ? '4' : '3'
			};
			this.handleSearch(sort);
		},
		handleSearch(sort) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/paper/3/result', 
				{ 
					...this.$route.query, 
					...sort
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_INIT');
		},
		handleTabNum(data) {
			this.tabNums = [
				data.exam_count, data.not_exam_count, data.exam_times_0,
				data.exam_times_1, data.exam_times_2, data.exam_times_3,
				data.wait_count, data.pass_count, data.not_pass_count
			];
			switch (this.tabs.length) {
				case 6:
					return this.tabNums.splice(3, 3);
				case 7:
					return this.tabNums.splice(4, 2);
				case 8:
					return this.tabNums.splice(5, 1);
				default:
					return this.tabNums;
			}
		}
	}
};

</script>

<style lang="scss">
.v-hr-academy-train-detail-exam-6-result-list {
	padding-bottom: 30px;
	.__footer {
		width: calc(100% - 340px) !important;
	}
	.ivu-table-body {
		overflow-x: auto
	}
}
</style>
