<template>
	<div class="v-hr-archives-person-detail" style="height: inherit">
		<i-tabs
			v-if="scenario!=3"
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			name="tab1"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="item in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
				tab="tab1"
			>
				<oa-person v-if="type==='1'&&type===item.value" />
				<!-- <oa-training v-if="type==='2'&&type===item.value" /> -->
				<oa-score v-if="type==='3'&&type===item.value" />
				<oa-promote v-if="type==='4'&&type===item.value" />
				<oa-other v-if="type==='5'&&type===item.value" />
			</i-tab-pane>
		</i-tabs>
		<oa-waiting-entry v-else :show-depart="false"/>
	</div>

</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import WaitingEntry from './waiting-entry';
import Person from './person/person';
// import Training from './training/training';
import Score from './score/score';
import Promote from './promote/promote';
import Other from './other/other';

export default {
	name: "v-hr-archives-person-detail",
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-person': Person,
		'oa-score': Score,
		'oa-promote': Promote,
		'oa-waiting-entry': WaitingEntry,
		// 'oa-training': Training,
		'oa-other': Other
	},
	data() {
		const { query } = this.$route;
		return {
			data: {},
			scenario: query.scenario || '',
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{
					label: "个人信息",
					value: "1"
				},
				// {
				// 	label: "培训信息",
				// 	value: "2"
				// },
				{
					label: "积分学分",
					value: "3"
				},
				{
					label: "晋升晋级",
					value: "4"
				},
				{
					label: "其他信息",
					value: "5"
				}
			],
		};
	},
	methods: {
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl();
			query = {
				...query,
				type,
			};
			this.$router.replace(
				getHashUrl("/hr/archives/person/details", { ...query })
			);
		}
	}
};

</script>

<style lang="scss">
</style>
