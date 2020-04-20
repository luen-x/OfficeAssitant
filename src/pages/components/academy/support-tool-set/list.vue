<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:load-expand-data="loadExpandData"
		:expand-opts="expand"
		:table-opts="{height: tableHeight}"
		mode="table"
		class="g-m-t-20 v-academy-support-tool-set-list"
		@page-change="handlePageChange"
		@page-size-change="handleChangePageSize"
		@selection-change="handleSelectionChange"
		@select="handleSelect"
		@row-click="handleRowClick"
		@expand="handleExpand"
	>
		<div v-if="this.$auth[1615]" slot="extra" class="g-flex-ac">
			<i-checkbox
				v-model="isAll"
				@on-change="handleIsAll"
			>
				全选
			</i-checkbox>
			<i-button @click="handleDelateAll">全部删除</i-button>
		</div>
	</vc-paging>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// import checkAll from '@extends/mixins/checkAll';
import { Confirm } from "@components/_common/confirm/confirm";
import keepSelect from '@extends/mixins/keepSelects';
import { tableHeight } from '@extends/mixins/tableHeight';
import { Checkbox, Button } from 'iview';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [
		item,
		keepSelect({ rowKey: 'category_id' }),
		tableHeight({})
	],
	data() {
		const { query } = this.$route;
		return {
			listData: [],
			loading: null,
			expand: {
				all: false,
				key: "id",
				keys: [],
			},
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academySupportToolSet.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			let { query = {} } = getParseUrl();
			this.isSelect = false;
			return this.request({
				url: 'ACADEMY_SUPPORT_TOOL_SET_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					kit_type: 2,
				},
			}).then((res) => {
				// this.listData = res.data.list
				this.afterLoadData(res);
			}).catch((error) => {
				console.error(error);
			});
		},
		loadExpandData(opts) {
			const { index } = opts;
			this.loading = index;
			return this.$request({
				url: 'ACADEMY_SUPPORT_TOOL_SET_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					kit_type: 2,
					pid: opts.row.category_id,
				}
			}).then((res) => {
				this.loading = null;
				this.afterLoadData();
				return res.data.list;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleExpand({ maxLevel, children }) {
			this.columns[2].minWidth = 160 + (maxLevel - 1) * 20;
			this.$nextTick(() => {
				this.afterLoadData();
			});

			// this.$refs.tableTarget.loadExpandData(opts);
		},
		beforeChangePageSize() {
			// this.isAll = false;
			this.$store.commit('ACADEMY_SUPPORT_TOOL_SET_LIST_GET');
		},
		handleSelect() {

		},
		handleRowClick(row, index) {
			// this.$refs.tableTarget.$refs.tableTarget.toggleSelect(index);

		},
		handleDelateAll() {
			if (!this.selects.length) {
				this.$Message.warning('请先选择要批量删除的素材。');
				return;
			}
			// let arr = [];
			// this.selects.map((e) => {
			// 	arr.push(e.category_id);
			// 	return;
			// });
			Confirm.popup({
				title: '提示',
				msg: '你是否确认删除所选素材？',
				showBtn: true
			}).then(() => {
				// 进行指派
				this.$request({
					url: '_ACADEMY_SUPPORT_TOOL_CATEGORY_DELETE_GET',
					type: 'POST',
					param: {
						category_ids: this.selects.map(i => i.category_id)
					}
				}).then((res) => {
					this.isAll = false;
					this.$Message.success('删除成功！');
					this.$store.commit('ACADEMY_SUPPORT_TOOL_SET_LIST_INIT');
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}).catch((err) => {
				console.error(err);
			});
		}
	}
};

</script>

<style lang="scss">
.v-academy-support-tool-set-list{
	._handle{
		li{
			height: 32px;
			line-height: 32px;
			padding: 0 10px;
			box-sizing: border-box;
			&:hover{
				background: #f4f5f7;
			}
		}
	}
	.ivu-poptip-body{
		padding: 8px 0;
	}
	.ivu-poptip, .ivu-poptip-rel {
		width: 100%;
		height: 100%;
	}
}
</style>
