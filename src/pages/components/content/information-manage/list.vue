<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight}"
		mode="table"
		class="g-m-t-20 v-content-information-manage-list"
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
			<i-button @click="handleAllDetel">批量删除</i-button>
		</div>
	</vc-paging>
</template>

<script>
import { Button, Message, Checkbox } from "iview";
import { Paging } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/table';
import { Confirm } from "@components/_common/confirm/confirm";
import API_ROOT from "@stores/apis/root";
// item
import item from "./item";

export default {
	name: "oa-table",
	components: {
		"vc-paging": Paging,
		"i-button": Button,
		"i-checkbox": Checkbox
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true
		})
	],
	data() {
		const { query } = this.$route;
		return {};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentInformationManage.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: "CONTENT_INFORMATION_MANAGE_LIST_GET",
				type: "GET",
				param: {
					...query,
					page,
					pageSize
				}
			}).then(res => {}).catch(error => {});
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit("CONTENT_INFORMATION_MANAGE_LIST_INIT");
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleAllDetel() {
			if (!this.selected.length) {
				this.$Message.warning("请先选择要批量删除的素材。");
				return;
			}

			let arr = [];

			this.selected.map(e => {
				arr.push(e.information_id);

				return;
			});

			Confirm.popup({
				title: "温馨提示",
				msg: "确定删除这些资讯吗？",
				content: "确定删除这些资讯吗？"
			}).then(v => {
				if (v == 1) {
					this.$request({
						url: API_ROOT._CONTENT_INFORMATION_MANAGE_BATCH_POST,
						type: "POST",
						param: {
							information_ids: arr
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.$store.commit('CONTENT_INFORMATION_MANAGE_LIST_RESET', {
							type: this.type
						});
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
</style>