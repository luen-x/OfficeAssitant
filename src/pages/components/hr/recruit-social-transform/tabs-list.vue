<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 16px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label"
			:name="item.value"
		>
			<div v-if="type === 'social-transform' && type === item.value">
				<social-transform :columns="getColumns('social-transform')"/>
			</div>
			<div v-if="type === 'entry-trend' && type === item.value">
				<entry-trend :columns="getColumns('entry-trend')"/>
			</div>
			<div v-if="type === 'social-follow' && type === item.value">
				<social-follow :columns="getColumns('social-follow')"/>
			</div>
			<div v-if="type === 'interviewer-statistics' && type === item.value">
				<interviewer-statistics :columns="getColumns('interviewer-statistics')"/>
			</div>
			<div v-if="type === 'recruitment-form' && type === item.value">
				<recruitment-form/>
			</div>
			<div v-if="type === 'position-analyze' && type === item.value">
				<position-analyze :columns="getColumns('position-analyze')"/>
			</div>
			
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import item from './item';
import socialTransform from './tabs/social-transform/content';
import socialFollow from './tabs/social-follow/content';
import entryTrend from './tabs/entry-trend/content';
import interviewerStatistics from './tabs/interviewer-statistics/content';
import interviewRecord from './tabs/interview-record/content';
import socialStatistics from './tabs/social-statistics/content';
import recruitmentForm from './tabs/recruitment-form/content';
import positionAnalyze from './tabs/position-analyze/content';

let config = {
	'social-transform': { 
		label: '社招转化', 
		value: 'social-transform', 
		auth: 1520, 
		commit: 'HR_RECRUIT_SOCIAL_TRANSFORM_LIST_INIT'
	},
	'interviewer-statistics': { 
		label: '面试官转化', 
		value: 'interviewer-statistics', 
		auth: 1522, 
		commit: 'HR_RECRUIT_INTERVIEWER_STATISTICS_LIST_INIT' 
	},
	'position-analyze': { 
		label: '职位分析', 
		value: 'position-analyze', 
		auth: 1523, 
		commit: 'HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_INIT'
	},
	'recruitment-form': { 
		label: '招聘需求', 
		value: 'recruitment-form', 
		auth: 1527, 
		commit: 'HR_RECRUIT_SOCIAL_SOCIAL_NEED_POSITION_LIST_INIT' 
	},
	'social-follow': { 
		label: '社招总表', 
		value: 'social-follow', 
		auth: 1529, 
		commit: 'HR_RECRUIT_SOCIAL_FOLLOW_LIST_INIT'
	},
	'entry-trend': { 
		label: '入职趋势图', 
		value: 'entry-trend', 
		auth: 1530 
	},
};
export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'social-transform': socialTransform,
		'social-follow': socialFollow,
		'entry-trend': entryTrend,
		'interviewer-statistics': interviewerStatistics,
		'interview-record': interviewRecord,
		'social-statistics': socialStatistics,
		'recruitment-form': recruitmentForm,
		'position-analyze': positionAnalyze
	},
	mixins: [item],
	data() {
		const { query } = this.$route;
		return {
			type: '',
			current: {},
			tabs: [],
		};
	},
	mounted() {
		for (let name in config) {
			if (this.$auth[config[name].auth]) {
			 this.tabs.push({
					label: config[name].label,
					value: name,
			 });
			}
		}
		const { query } = this.$route;
		this.type = query.type ? query.type : this.tabs[0].value;
		this.$store.commit('HR_RECRUIT_SOCIAL_TRANSFORM_SET_TYPE', this.type);
	},
	methods: {
		handleChange(type) {
			this.type = type;
			this.$store.commit('HR_RECRUIT_SOCIAL_TRANSFORM_SET_TYPE', type);

			this.$router.replace(getHashUrl('/hr/recruit/social/statistics', {
				type
			}));
			// tab切换echarts获取数据
			config[type] && config[type].commit && this.$store.commit(config[type].commit);
		}
	}
};

</script>

<style lang="scss">

</style>
