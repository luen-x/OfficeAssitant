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
				:columns="getColumns(item.value)"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:table-opts="{height: tableHeight}"
				:load-data="loadData"
				class="v-hr-recruit-social-social-transform-details-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getParseUrl, getHashUrl } from '@utils/utils';
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
			nav2: false, tab: false, extra: 110
		})
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			count: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			tabs: [
				{ label: '录入简历人数', value: '1' }, 
				{ label: '实际面试人数', value: '2' }, 
				{ label: '面试通过人数', value: '3' },
				{ label: '试岗人数', value: '4' },
				{ label: '入职人数', value: '5' },
				{ label: '转介绍人数', value: '6' },
				{ label: '面试淘汰人数', value: '7' },
				{ label: '试岗完成淘汰人数', value: '8' },
				{ label: '淘汰总数', value: '9' },
				{ label: '15天内离职人数', value: '10' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSocialSocialTransformDetails.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [ 
					res.data.entering_count, // 录入简历数量
					res.data.actual_interview_count, // 实际面试数量
					res.data.pass_interview_count, // 面试通过数量
					res.data.try_count, // 试岗数量
					res.data.entry_count, // 入职数量
					res.data.ex_introduce_count, // 转介绍数量
					res.data.pass_by_interview_count, // 面试淘汰数量
					res.data.try_end_pass_count, // 试岗完成淘汰数量
					res.data.disuse_count, // 淘汰总数
					res.data.leave_count // 15天内离职人数
				];
			}).catch((error) => {
				console.error(error);
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
			this.$router.replace(getHashUrl('/hr/recruit/social/social-transform-details', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
