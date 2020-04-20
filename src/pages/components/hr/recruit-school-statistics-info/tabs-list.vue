<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="`${item.label} ${listInfo.count[index]}`"
			:name="item.value"
		>
			<vc-paging
				:columns="getColumns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-hr-recruit-school-statistics-info-list"
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
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
			extraHeight: 50
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '录入人员', value: '0' },
				{ label: '发offer人员', value: '1' },
				{ label: '已回复人员', value: '2' },
				{ label: '报到人员', value: '3' },
				{ label: '试岗人员', value: '4' },
				{ label: '入职人员', value: '5' },
				{ label: '淘汰人员', value: '6' },
				{ label: '离开人员', value: '7' },
				{ label: '1月内流失人员', value: '8' },
				{ label: '1-3月流失人员', value: '9' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSchoolStatisticsInfo.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('0', this.listInfo.count, '/hr/recruit/school/statistics/info');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/recruit/school/statistics/info', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
