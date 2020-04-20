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
		:table-opts="{height: tableHeight,}"
		mode="table"
		class="g-m-t-20 v-content-config-material-set-list"
		@page-size-change="handleChangePageSize"
		@page-change="handlePageChange"
		@selection-change="handleSelectionChange"
		@expand="handleExpand"
	>
		<div slot="extra" class="g-flex-ac">
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
import checkAll from '@extends/mixins/checkAll';
import { Checkbox, Button } from 'iview';
import API_ROOT from "@stores/apis/root";
import { tableHeight } from '@extends/mixins/tableHeight';
import { Confirm } from "../_common/confirm";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll, tableHeight({ tab: false, extra: 40 })],
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
			return this.$store.state.contentConfigMaterialSet.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_CONFIG_MATERIAL_SET_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					kit_type: 1,
					is_control_role: 0
				},
			}).then((res) => {

				this.listData = res.data.list;
			}).catch((error) => {
				console.error(error);
			});
		},
		loadExpandData(opts) {
			const { index } = opts;
			this.loading = index;
			return this.$request({
				url: API_ROOT.CONTENT_CONFIG_MATERIAL_SET_LIST_GET,
				type: 'GET',
				loading: false,
				param: {
					kit_type: 1,
					pid: opts.row.category_id,
					is_control_role: 0
				}
			}).then((res) => {

				this.loading = null;
				return res.data.list;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleExpand({ maxLevel, children, }) {
			this.columns[2].width = 60 + (maxLevel - 1) * 20;
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('CONTENT_CONFIG_MATERIAL_SET_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleDelateAll() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要批量删除的素材。');
				return;
			}
			let arr = [];
			this.selected.map((e) => {
				arr.push(e.category_id);
				return;
			});
			Confirm.popup({
				title: '提示',
				msg: '你是否确认删除所选素材？',
				showBtn: true
			}).then(() => {
				// 进行指派
				this.$request({
					url: API_ROOT._CONTENT_CONFIG_LIBRARY_CATEGORY_BATCH_DEL_POST,
					type: 'POST',
					param: {
						category_ids: arr
					}
				}).then((res) => {
					this.isAll = false;
					this.$Message.success('删除成功！');
					this.$store.commit('CONTENT_CONFIG_MATERIAL_SET_LIST_INIT');
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

</style>
