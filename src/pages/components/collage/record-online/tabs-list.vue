<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		class="v-record-online-list"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item, i) in tabs"
			:key="item.value"
			:label="`${item.label}${tabsNum[i]}`"
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
				class="v-collage-record-online-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@row-click="handleRowClick"
				@sort-change="handleSortChange"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import { DetailDrawer } from './popup/detail-drawer';
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
			extra: -40
		}),
		autoFix()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待录单', value: '1' }, 
				{ label: '已录单', value: '2' }, 
				{ label: '待审核', value: '3' },
				{ label: '已通过', value: '4' }
				// { label: '已驳回', value: '5' }
			],
			tabsNum: [0, 0, 0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.collageRecordOnline.listInfo;
		}
	},
	created() {
		this.$store.commit('COLLAGE_RECORD_ONLINE_SELECTED_TAB', this.type);
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'COLLAGE_RECORD_ONLINE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					lesson_type: 1
				},
			}).then((res) => {
				this.tabsNum = res.data.count;
			}).catch((error) => {
			});
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_COLLAGE_BUSINESS_TABLE_INFO_GET",
				type: "GET",
				param: {
					type: type || "1",
					scenario: 3
				},
				loading: false,
			}).then(res => {
				this.$store.commit('COLLAGE_RECORD_ONLINE_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/collage/record/online', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('COLLAGE_RECORD_ONLINE_LIST_INIT');
		},
		handleRowClick(rowData) {
			if (!this.$auth['1402']) {
				this.$Message.error('您没有权限奥？');
				return;
			}
			DetailDrawer.popup({
				lessonInfo: { ...rowData }
			}).catch(err => {})
				.finally(() => {
					this.handleResetCur();
				});
		},
		handleSortChange({ key, order }) {
			const {
				order_time,
				assign_time,
				...other
			} = this.$route.query;
			this.$router.replace({
				path: this.$route.path,
				query: {
					...other,
					[key]: order === 'desc' ? 'desc' : 'asc'
				}
			});
			this.$store.commit('COLLAGE_RECORD_ONLINE_LIST_RESET', { type: this.type });
		}
	}
};

</script>

<style lang="scss">
.v-record-online-list {
	._remark {
		position: absolute;
		padding: 0 8px;
		border-radius: 2px;
		background-color: #e74854;
		color: #fff;
		font-size: 12px;
		right: 10px
	}
}
</style>
