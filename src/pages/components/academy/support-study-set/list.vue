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
		class="g-m-t-20 v-academy-support-study-set-list"
		@page-size-change="handleChangePageSize"
		@page-change="handlePageChange"
		@selection-change="handleSelectionChange"
		@expand="handleExpand"
	>
		<div v-if="$auth[1629]" slot="extra" class="g-flex-ac">
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
import keepSelect from '@extends/mixins/keepSelects';
import { Confirm } from "@components/_common/confirm/confirm";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll, keepSelect({ rowKey: 'category_id' }), tableHeight({ tab: false, extra: 40 })],
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

			return this.$store.state.academySupportStudySet.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'ACADEMY_SUPPORT_STUDY_SET_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					kit_type: 1,
				},
			}).then((res) => {
				this.afterLoadData(res);
				this.listData = res.data.list;
			}).catch((error) => {
				console.error(error);
			});
		},
		loadExpandData(opts) {
			const { index } = opts;
			this.loading = index;
			return this.$request({
				url: 'ACADEMY_SUPPORT_STUDY_SET_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
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
		handleExpand({ maxLevel, children, }) {
			this.columns[2].width = 60 + (maxLevel - 1) * 20;
			this.$nextTick(() => {
				this.afterLoadData();
			});
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('ACADEMY_SUPPORT_STUDY_SET_LIST_INIT');
		},
		handleDelateAll() {
			if (!this.selects.length) {
				this.$Message.warning('请先选择要批量删除的类目。');
				return;
			}
			Confirm.popup({
				title: '提示',
				msg: '你是否确认删除所选类目？',
				showBtn: true
			}).then(() => {
				// 进行指派
				this.$request({
					url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_DELETE_GET',
					type: 'POST',
					param: {
						category_ids: this.selects.map(i => i.category_id)
					}
				}).then((res) => {
					this.isAll = false;
					this.$Message.success('删除成功！');
					this.$store.commit('ACADEMY_SUPPORT_STUDY_SET_LIST_INIT');
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

