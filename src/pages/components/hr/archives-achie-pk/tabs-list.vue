<template>
	<div>
		<oa-filter :month="month"/>
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
				:label="item.label" 
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
					:load-data="loadData"
					:table-opts="{height: tableHeight}"
					class="v-hr-archives-achie-pk-list"
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
import { tableHeight } from "@extends/mixins/table";
import Filter from './filter';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"oa-filter": Filter,
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true
		})
	],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			month: '',
			tabs: [
				{ label: '战区PK', value: '1' }, 
				{ label: '部门PK', value: '2' }, 
				{ label: '员工PK', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrArchivesAchiePk.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ARCHIVES_ACHIE_PK_LIST_GET',
				type: 'GET',
				param: {
					...query,
					month: query.month,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.month = res.data.month;
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
			this.$router.replace(getHashUrl('/hr/archives/achie/pk', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_ARCHIVES_ACHIE_PK_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
