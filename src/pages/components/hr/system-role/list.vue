<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		class="g-m-t-20 v-hr-role-list"
		@on-click="handleChange"
	>
		<div v-if="tabs.length">
			<i-tab-pane 
				v-for="(item, i) in tabs"
				:key="item.depart_id"
				:label="item.depart_name" 
				:name="i + ''"
			>
			
				<div v-if="tabs.length">
					<vc-paging
						ref="tableTarget"
						:columns="columns"
						:show="i == type" 
						:type="i"
						:data-source="listInfo[i].data"
						:total="listInfo[i].total"
						:reset="listInfo[i].reset"
						:current.sync="current[i]"
						:history="true"
						:load-data="loadData"
						:table-opts="{ 'tooltip-theme': 'light' }"
						mode="table"
						@page-change="handlePageChange"
						@page-size-change="handleChangePageSize"
						@selection-change="handleSelectionChange"
					>
						<div slot="extra" class="g-flex-ac">
							<i-checkbox
								v-model="isAll"
								@on-change="handleIsAll"
							>
								全选
							</i-checkbox>
							<i-button @click="handleBatchDel">批量删除</i-button>
						</div>
					</vc-paging>
				</div>
			</i-tab-pane>
		</div>
	</i-tabs>
</template>

<script>
import { Checkbox, Button, Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/table';
import API_ROOT from '@stores/apis/root';
import { PModalDelete } from './popup/delete';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			filter: true,
			footer: true
		})
	],
	data() {
		const { query } = this.$route;

		return {
			tabs: [],
			type: String(query.type || '0'),
			current: {},
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrSystemRole.listInfo;
		}
	},
	created() {
		this.loadTabsData();
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ROLE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					first_depart_id: this.handleNowDepartInfo().depart_id,
					page,
					pageSize
				},
			}).then((res) => {
				if (!this.$route.query.first_depart_id) {
					this.$router.replace(getHashUrl('/hr/system/role', { 
						...query,
						first_depart_id: this.handleNowDepartInfo().depart_id }));
				}
			}).catch((error) => {
				console.error(error);
			});
		},
		async loadTabsData() {
			const { data } = await this.$request({
				url: API_ROOT.HR_STAIR_DEPART_GET,
				type: "GET",
				loading: false
			});
			this.tabs = data;
			this.$store.commit('HR_ROLE_LIST_TABS_INIT', data);
		},
		handleChange(type) {
			this.type = type;
			this.isAll = false;
			this.handleIsAll(false);
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				first_depart_id: this.handleNowDepartInfo().depart_id,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/system/role', { ...query }));
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ROLE_LIST_INIT');
		},
		handleNowDepartInfo() {
			return this.tabs[this.type];
		},
		// 点击全选
		handleIsAll(val) {
			this.$refs.tableTarget[this.type].$refs.tableTarget.selectAll(val);
		},
		handleBatchDel() {
			if (this.selected.length <= 0) {
				this.$Message.warning('请至少选择一项进行操作！');
				return;
			}
			// 是否有人 可以删除返回false
			const canDelete = this.selected.some(v => v.use_num);
			let message = '';
			if (canDelete) {
				message = '存在角色人数不为0，不可批量删除';
			}
			message = '删除后不可恢复，确认删除?';
			const roleIds = this.selected.map(v => v.role_id);
			if (!roleIds.length) {
				return;
			}
			PModalDelete.popup({
				role_ids: roleIds,
				message,
				canDelete
			}).then(res => {
				this.isAll = false;
			}).catch(() => {});
		}
	}
};

</script>

<style lang="scss">

</style>
