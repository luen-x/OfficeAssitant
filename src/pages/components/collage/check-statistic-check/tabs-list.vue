<template>
	<div class="v-collage-check-statistic-check-list">
		<div class="g-bg-gray-mid g-m-t-20 g-m-b-20 g-flex g-jc-sb g-pd-t-20 g-pd-b-20 _top">
			<div
				v-for="(item,index) in average_data"
				:key="index"
				:style="index === average_data.length - 1 ? {borderRight: 0} : ''"
				class="__average"
			>
				<div class="g-tc g-pd-t-10 g-fs-12" style="color: #818794;">{{ item.name }}</div>
				<div class="g-tc g-m-t-5 g-c-black2 g-fs-24">{{ item.average }}</div>
			</div>
		</div>
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
				:label="item.label + listInfo.count[index]" 
				:name="item.value"
			>
				<vc-paging
					:ref="'table' + item.value"
					:columns="getColumns"
					:show="item.value == type" 
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight, highlightRow: true}"
					class="v-collage-check-statistic-check-list"
					mode="table"
					@page-size-change="handleChangePageSize"
					@row-click="handleOpenDrawer"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
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
			footer: true
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [],
			average_data: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.collageCheckStatisticCheck.listInfo;
		}
	},
	created() {
		this.$auth[1361] && this.tabs.push({ label: '线上培训', value: '1' });
		this.$auth[1362] && this.tabs.push({ label: '线下培训', value: '2' });
		this.tabs.push({ label: '客户数据', value: '3' });
	},
	mounted() {
		this.loadAverageData();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			let depart_id = null;

			if (query.depart_id) {
				let arr = (query.depart_id + "").split(",");
				depart_id = arr[arr.length - 1];
			}

			return this.request({
				url: 'COLLAGE_CHECK_STATISTIC_CHECK_LIST_GET',
				type: 'GET',
				param: {
					...query,
					depart_id,
					fixPosition: false,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/collage/check/statistic/check');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		loadAverageData() {
			 this.$request({
				url: '_COLLAGE_CHECK_SERVICE_LESSON_SCORE_STATIC_GET',
				type: 'GET',
				param: {},
			}).then((res) => {
				this.average_data = [{
					name: "套系总平均分",
					average: res.data.lesson_whole_score_static.average
				}, {
					name: "讲师平均分",
					average: res.data.lecture_score_static.average
				}, {
					name: "线下主持人平均分",
					average: res.data.host_score_static.average
				}, {
					name: "线上流程对接平均分",
					average: res.data.process_score_static.average
				}];
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
			this.$router.replace(getHashUrl('/collage/check/statistic/check', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('COLLAGE_CHECK_STATISTIC_CHECK_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-collage-check-statistic-check-list{
	._top{
		height: 114px;

		.__average{
			width: 25%;
			height: 74px;
			border-right: 1px solid #D4D7DB;
		}
	}
}
</style>