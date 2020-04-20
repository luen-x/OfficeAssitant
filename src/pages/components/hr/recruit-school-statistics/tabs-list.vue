<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			label="招聘会统计" 
			name="1"
		>
			<oa-statistics :data="statistics"/>
			<vc-paging
				:columns="columns1"
				:show="'1' == type" 
				:type="'1'"
				:data-source="listInfo['1'].data"
				:table-opts="{height: tableHeight}"
				:total="listInfo['1'].total"
				:reset="listInfo['1'].reset"
				:current.sync="current['1']"
				:history="true"
				:load-data="loadData"
				class="v-hr-recruit-school-statistics-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
		<i-tab-pane
			label="试岗统计" 
			name="2"
		>
			<vc-paging
				ref="table"
				:show="'2' == type" 
				:columns="columns2"
				:data-source="{1: listInfo.list}"
				:table-opts="{height: tableHeight}"
				:total="1"
				:history="true"
				:footer="false"
				:load-data="loadData"
				:expand-opts="expand"
				@expand="handleExpand"
			/>
		</i-tab-pane>
		<i-tab-pane
			label="职位统计" 
			name="3"
		>
			<vc-paging
				:columns="columns3"
				:show="'3' == type" 
				:type="'3'"
				:data-source="listInfo['3'].data"
				:table-opts="{height: tableHeight}"
				:total="listInfo['3'].total"
				:reset="listInfo['3'].reset"
				:current.sync="current['3']"
				:history="true"
				:load-data="loadData"
				class="v-hr-recruit-school-statistics-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import Statistics from '@components/hr/recruit-school-statistics/statistics';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"oa-statistics": Statistics,
	},
	mixins: [item, tableHeight({ extraClass: ['v-hr-recruit-school-statistics-content'] })],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			expand: {
				all: false,
				keys: [1],
				key: 'depart_id'
			},
			statistics: {}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSchoolStatistics.listInfo;
		},
		isFetched() {
			return this.$store.state.hrRecruitSchoolStatistics.listInfo.isFetched;
		}
	},
	watch: {
		isFetched(newVal, oldVal) {
			if (!newVal && oldVal) {
				this.loadData();
			}
		}
	},
	methods: {
		loadData(page, pageSize) {
			// HR_RECRUIT_SCHOOL_STATISTICS_DATA_LIST_GET
			let { query = {} } = getParseUrl();
			return this.request({
				url: this.type == '1' ? 'HR_RECRUIT_SCHOOL_STATISTICS_LIST_GET' 
					: this.type == '2' 
						? 'HR_RECRUIT_SCHOOL_STATISTICS_DATA_LIST_GET' 
						: 'HR_RECRUIT_SCHOOL_STATISTICS_POSITION_LIST_GET',
				redirect: 'HR_RECRUIT_SCHOOL_STATISTICS_LIST_GET_SUCCESS',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.type == '1' ? this.statistics = res.data : '';
			}).catch(console.error);
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/recruit/school/statistics', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SCHOOL_STATISTICS_LIST_INIT');
		},
		handleExpand({ maxLevel }) {
			this.columns2[0].width = maxLevel * 10 + 200;
		},
	}
};

</script>

<style lang="scss">

</style>
