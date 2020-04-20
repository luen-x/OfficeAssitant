<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		class="v-collage-check-service"
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
				:table-opts="{height: tableHeight, highlightRow: true}"
				:history="true"
				:load-data="loadData"
				class="v-collage-check-service-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
				@row-click="handleOpenDrawer"
			>
				<div slot="extra" class="g-flex-ac">
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button 
						v-if="$auth[1344]" 
						@click="handleBatchAudit"
					>批量分配</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import checkAll from '@extends/mixins/checkAll';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { autoFix } from '@extends/mixins/auto-fix';
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll, tableHeight(), autoFix()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待分配', value: '1' }, 
				{ label: '待质检', value: '2' }, 
				{ label: '已质检', value: '3' },
				{ label: '已失效', value: '4' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.collageCheckService.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'COLLAGE_CHECK_SERVICE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/collage/check/service');
			}).catch((error) => {
				console.error(error);
			});
		},

		loadTableTitle(type) {
			return this.$request({
				url: "_COLLAGE_BUSINESS_TABLE_INFO_GET",
				type: "GET",
				param: {
					type: type || "1",
					scenario: 6
				},
				loading: false,
			}).then(res => {
				this.$store.commit('COLLAGE_CHECK_SERVICE_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleChange(type) {
			this.type = type;
			this.isAll = false;
			this.handleIsAll(false);

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/collage/check/service', { ...query }));
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('COLLAGE_CHECK_SERVICE_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleBatchAudit() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要分配的项');
				return;
			}
			const quality_ids = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.quality_id);
				return initVal;
			}, []);
			this.handleAllocate(quality_ids);
		},
	}
};

</script>

<style lang="scss">
.v-collage-check-service {
	._tag {
		color: #fff;
		background-color: #E74854;
		padding: 2px;
		border-radius: 3px;
	}
}
</style>
