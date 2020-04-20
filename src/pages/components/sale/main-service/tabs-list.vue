<template>
	<div class="v-sale-main-service-tabs-list-content">
		<div class="_statistic g-flex g-m-t-20">
			<div
				v-for="(item, index) in staticList"
				:key="item.key"
				:class="index !== staticList.length - 1 ? '_line' : ''"
				class="_item g-flex g-ai-c g-jc-c"
			>
				<div class="g-tc g-pointer" @click="handleClick(index)">
					<div class="g-m-b-15" style="color: #818794">{{ item.key }}</div>
					<div class="g-fs-24 g-c-black2">{{ item.value }}%</div>
				</div>
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
				:label="`${item.label}  ${count[index]}`"
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
					:load-data="loadData"
					class="v-sale-main-service-list"
					mode="table"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
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
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			count: [0, 0, 0, 0],
			tabs: [
				{ label: '所有客户', value: '1' },
				{ label: '<6分/雷区客户', value: '2' },
				{ label: '6≤X<8分客户', value: '3' },
				{ label: '8≤X≤10分客户', value: '4' }
			],
			staticList: [
				{ key: '客户小于6分率', value: 0 },
				{ key: '客户8分率', value: 0 },
				{ key: '客户9分率', value: 0 },
				{ key: '客户10分率', value: 0 }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleMainService.listInfo;
		}

	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_MAIN_SERVICE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = res.data.count || [0, 0, 0, 0];
				this.loadScore();
				
			}).catch(console.error);
		},
		loadScore() {
			let { query = {} } = getParseUrl();
			return this.$request({
				url: '_SALE_MAIN_SERVICE_SCORE_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
				},
			}).then((res) => {
				Object.keys(res.data.service_score_step_rate_static).forEach((key, index) => {
					this.staticList[index].value = res.data.service_score_step_rate_static[key];
				});
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
			this.$router.replace(getHashUrl('/sale/main/service', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_MAIN_SERVICE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-sale-main-service-tabs-list-content{
	._statistic {
		width: 100%;
		height: 114px;
		padding-top: 20px;
		padding-bottom: 20px;
		background: #F5F5F6;
		._item {
			flex: 1;
			height: 100%;
		}
		._line {
			border-right: 1px solid #D4D7DB;
		}
	}
	.ivu-tabs-tab {
		min-width: 150px !important;
	}
}
</style>
