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
				class="v-collage-salary-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import moment from 'moment';
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
			type: query.type ? String(query.type) : this.$auth[1332] ? '1' : '2', // 同tabs下的value
			current: {},
			// tabs: tab
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.collageSalary.listInfo;
		},
		tabs() {
			let tab = [];
			let tabAuth = [
				{
					label: '我的薪资',
					value: '1',
					auth: 1332
				},
				{
					label: '员工薪资',
					value: '2',
					auth: 1333
				}
			];
			Object.keys(this.$auth).forEach(e => {
				tabAuth.forEach(v => {
					if (e == v.auth) {
						tab.push(v);
					}
				});
			});
			return tab;
		}
	},
	methods: {
		loadTableTitle(type) {
			return this.$request({
				url: "_COLLAGE_BUSINESS_TABLE_INFO_GET",
				type: "GET",
				param: {
					type: type || "1",
					scenario: 8
				},
				loading: false,
			}).then(res => {
				this.$store.commit('COLLAGE_SALARY_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'COLLAGE_SALARY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
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
				page: this.current[type],
				month: type == '2' ? moment().format('YYYY-MM') : '',
			};
			this.$router.replace({
				path: '/collage/salary',
				query,
			});
			this.$store.commit('COLLAGE_SALARY_LIST_INIT', this.$route.query.month);
			// this.$store.commit('COLLAGE_SALARY_LIST_INIT');
		},
		handleChangePageSize() {
			this.$store.commit('COLLAGE_SALARY_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
