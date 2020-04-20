<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label +' '+ item.count"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-academy-support-case-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div v-if="$auth[1]" slot="extra" class="g-flex-ac">
					<i-checkbox v-model="isAll" @on-change="handleIsAll">全选</i-checkbox>
					<i-button v-if="$auth[1761]" @click="handleBatchDelete">删除</i-button>
			</div></vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Button, Checkbox } from 'iview';
import { Paging } from 'wya-vc';
import checkAll from '@extends/mixins/checkAll';
import { services as saleServices } from '@stores/services/sale';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		'i-checkbox': Checkbox
	},
	mixins: [item, saleServices.industryList(), checkAll, tableHeight({ expand: false, nav2: false, extra: 30 })],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '所有案例', value: '0', count: 0 } 
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academySupportCase.listInfo;
		}
	},
	async mounted() {
		await this.loadIndustryListPromise;
		const tabs = this.industryList.map(industry => ({ label: industry.industry_name, value: industry.industry_id + '', count: 0 }));
		this.tabs.push(...tabs);
		this.$store.commit('ACADEMY_SUPPORT_CASE_TAB_INIT', this.tabs);
		
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'ACADEMY_SUPPORT_CASE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.tabs.forEach(i => {
					i.count = (res.data.statistic || {})[i.value] || 0;
				});
				this.tabs[0].count = res.data.total || 0;

				
			}).catch(console.error);
		},
		handleChange(type) {
			this.handleIsAll(false);
			this.isAll = false;
			this.selected = [];
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/academy/support/case', { ...query }));
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('ACADEMY_SUPPORT_CASE_LIST_INIT');
		},
		handleIsAll(val) {
			const index = this.tabs.findIndex(t => t.value == this.type);
			this.$refs.tableTarget[index].$refs.tableTarget.selectAll(val);
		},

	}
};

</script>

<style lang="scss">

</style>
