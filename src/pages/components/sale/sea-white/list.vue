<template>
	<div>
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight, highlightRow: true}"
			mode="table"
			class="g-m-t-20 v-sale-white-list"
			@page-change="handlePageChange"
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
				<vc-debounce-click
					:tag="Button"
					@click="handleMultiReset"
				>
					恢复
				</vc-debounce-click>
			</div>
		</vc-paging>
	</div>
</template>

<script>
import { Checkbox, Button } from "iview";
import { debounce } from 'lodash';
import { Paging } from "wya-vc";
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getParseUrl, getHashUrl } from "@utils/utils";
// item
import item from "./item";

export default {
	name: "oa-sale-white-list",
	components: {
		"vc-paging": Paging,
		"i-checkbox": Checkbox
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			nav1: true,
			nav2: false,
			expand: false,
			extra: -16
		})
	],
	data() {
		const { query } = this.$route;
		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleSeaWhite.listInfo;
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: "SALE_SEA_WHITE_LIST_GET",
				type: "GET",
				loading: false,
				param: {
					...query,
					page,
					pageSize
				},
				autoTip: false
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 更新每页加载的条数
		 */
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit("SALE_SEA_WHITE_LIST_INIT");
		},
		/**
		 * 全选
		 */
		handleIsAll(val) {
			 this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		/**
		 * 单个恢复
		 */
		handleSingleReset: debounce(function (white_id) {
			this.$request({
				url: '_SALE_SEA_WHITE_RECOVERY_POST',
				type: "POST",
				loading: false,
				param: {
					param: {
						customer_id: white_id
					}
				},
				autoTip: true
			}).then(res => {
				this.$store.commit('SALE_SEA_WHITE_LIST_INIT');
			}).catch(error => {

			});
		}, 300),
		/**
		 * 批量恢复
		 */
		handleMultiReset() {
			const white_ids = this.selected.map(_item => {
				return _item.white_id;
			});

			if (white_ids.length) {
				this.$request({
					url: '_SALE_SEA_WHITE_RECOVERY_POST',
					type: "POST",
					loading: false,
					param: {
						param: white_ids
					},
					autoTip: true
				}).then(res => {
					this.$store.commit('SALE_SEA_WHITE_LIST_INIT');
					this.isAll = false;
				}).catch(error => {});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
	}
};
</script>

<style lang="scss">
.v-sale-white-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
