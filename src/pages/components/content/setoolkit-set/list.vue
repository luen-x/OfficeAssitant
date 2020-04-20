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
		mode="table"
		class="g-m-t-20 v-content-setoolkit-set-list"
		@page-change="handlePageChange"
		@page-size-change="handleChangePageSize"
		@selection-change="handleSelectionChange"
		@expand="handleExpand"
	>
		<div v-if="this.$auth[620]" slot="extra" class="g-flex-ac">
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
// item
import { Checkbox, Button } from 'iview';
import API_ROOT from "@stores/apis/root";
import { Confirm } from "../_common/confirm";
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll],
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
			return this.$store.state.contentSetoolkitSet.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			this.isSelect = false;
			return this.request({
				url: 'CONTENT_SETOOLKIT_SET_LIST_GET',
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
				url: API_ROOT.CONTENT_SETOOLKIT_SET_LIST_GET,
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
			this.columns[2].minWidth = 160 + (maxLevel - 1) * 20;
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('CONTENT_SETOOLKIT_SET_LIST_INIT');
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
					url: API_ROOT._CONTENT_CATEGORY_BATCH_DELATE_POST,
					type: 'POST',
					param: {
						category_ids: arr
					}
				}).then((res) => {
					this.isAll = false;
					this.$Message.success('删除成功！');
					this.$store.commit('CONTENT_SETOOLKIT_SET_LIST_INIT');
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

<style lang="scss" scoped>
	/deep/ ._handle{
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
	/deep/ .ivu-poptip-body{
		padding: 8px 0;
	}
	.v-content-setoolkit-set-list{
		/deep/ .ivu-poptip, .ivu-poptip-rel {
			width: 100%;
			height: 100%;
		}
	}
</style>
