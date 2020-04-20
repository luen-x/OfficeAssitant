<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item,index) in tabs"
			:key="item.value"
			:label="`${item.label} ${count[index]}`"
			:name="item.value"
		>
			<vc-paging
				:columns="columns"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:table-opts="{height: tableHeight}"
				:load-data="loadData"
				class="v-hr-recruit-social-statistics-position-details-list"
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
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, tableHeight()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			count: [0, 0, 0, 0, 0, 0],
			tabs: [
				{ label: '简历录入', value: '1' }, 
				{ label: '实际面试', value: '2' }, 
				{ label: '面试通过', value: '3' },
				{ label: '试岗中', value: '4' }, 
				{ label: '已入职', value: '5' }, 
				{ label: '已淘汰', value: '6' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSocialStatisticsPositionDetails.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SOCIAL_STATISTICS_POSITION_DETAILS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [res.data.entering_count, // 录入简历人数
					res.data.actual_interview_count, // 实际面试人数
					res.data.pass_interview_count, // 面试通过人数
					res.data.try_count, // 试岗人数
					res.data.entry_count, // 入职人数
					res.data.disuse_count// 淘汰人数
				];
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
			this.$router.replace(getHashUrl('/hr/recruit/social/statistics/position/details', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SOCIAL_STATISTICS_POSITION_DETAILS_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
