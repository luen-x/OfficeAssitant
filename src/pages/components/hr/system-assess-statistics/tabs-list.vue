<template>
	<div>
		<div class="g-flex g-jc-fe">
			<span 
				v-if="type === '1' && $auth[1189]" 
				class="g-red-btn-line" 
				@click="handleDeploy">配置</span>
			<span 
				v-if="type === '2' && $auth[1185]"
				class="g-red-btn-line" 
				@click="handleAdd">新增</span>
		</div>
		<i-tabs 
			:value="type" 
			:animated="false"
			type="card" 
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane 
				v-for="(item) in tabs.filter(i=>i.auth)"
				:key="item.value"
				:label="item.label" 
				:name="item.value"
			>
				<vc-paging
					:columns="columns[item.value]"
					:show="item.value == type" 
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight, highlightRow: true}"
					:footer="type === '2'"
					class="v-hr-system-assess-statistics-list"
					mode="table"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Button } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
// item
import item from './item';
import { DeployModal } from './popup/deploy';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
			extraHeight: 20
		})
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '数据配置', value: '1', auth: this.$auth[1188] }, 
				{ label: '互荐表配置', value: '2', auth: this.$auth[1184] }
			],
			data: { 1: [{}] }
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrSystemAssessStatistics.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: this.type === '1' ? 'HR_SYSTEM_ASSESS_STATISTICS_MAIN_LIST_GET' : 'HR_SYSTEM_ASSESS_STATISTICS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				
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
			this.$router.replace(getHashUrl('/hr/system/assess/statistics', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_SYSTEM_ASSESS_STATISTICS_LIST_INIT');
		},
		handleDeploy() {
			DeployModal.popup({
				dataHide: []
			}).then().catch(err => {});
		},
		handleAdd() {
			this.$router.push('/hr/system/assess/statistics/add');
		}
	}
};

</script>

<style lang="scss">

</style>
