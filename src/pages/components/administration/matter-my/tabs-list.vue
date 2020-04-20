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
			:label="item.label + listInfo.count[index]"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns[item.value]"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-administration-matter-my-list"
				mode="table"
				@row-click="handleShowDetail"
				@sort-change="handleSortChange"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
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
			tabs: [
				{ label: '待我审核', value: '1' },
				{ label: '处理中', value: '2' },
				{ label: '已完成', value: '3' },
				{ label: '已评价', value: '4' },
				{ label: '未通过', value: '5' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.administrationMatterMy.listInfo;
		}
	},
	beforeDestroy() {
		this.$vc.off('query-change');
	},
	methods: {
		loadData(page, pageSize) {
			let { query } = getParseUrl();
			return this.request({
				url: 'ADMINISTRATION_MATTER_MY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/administration/matter/my');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/administration/matter/my', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');
		},
		handleSortChange(obj) {
			let { query = {} } = getParseUrl();
			query[`order_by_${obj.key}`] = obj.order === 'asc' ? 0 : 1;
			this.$router.replace(getHashUrl('/administration/matter/my', { ...query }));
			this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');
		},
	}
};

</script>

<style lang="scss">

</style>
