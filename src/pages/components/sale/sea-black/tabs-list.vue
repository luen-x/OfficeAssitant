<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item) in tabs.filter(data => data.value != '0')"
			:key="item.value"
			:label="item.label"
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
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-sale-black-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
				@row-click="handleOpenDrawer"
			>
				<div
					v-if="is_charge || (item.value == '2' && $auth[688])"
					slot="extra"
					class="g-flex-ac"
				>
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<vc-debounce-click
						v-if="item.value == '2' && $auth[688]"
						:tag="Button"
						class="g-m-r-10"
						@click="handleMultiConfirm"
					>
						确认黑名单
					</vc-debounce-click>
					<vc-debounce-click
						v-if="is_charge"
						:tag="Button"
						class="g-m-r-10"
						@click="handleMultiDel"
					>
						删除黑名单
					</vc-debounce-click>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { debounce } from 'lodash';
import { Confirm } from '@components/_common/confirm/confirm';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

const indexMap = { '2': 0, '1': 1, '0': 2 };

export default {
	name: 'oa-black-list',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"i-checkbox": Checkbox
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			nav1: true,
			nav2: false,
		})
	],
	data() {
		const { query } = this.$route;

		return {
			type: '2', // 同tabs下的value
			current: {},
			tabs: [
				{ label: "待确认", value: "2" },
				{ label: "已确认", value: "1" }
			],
			curLength: null
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleSeaBlack.listInfo;
		},
		is_charge() {
			return this.$global.staff.is_charge;
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		const { query = {} } = getParseUrl();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			const { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_SEA_BLACK_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
				autoTip: false
			}).then((res) => {
				this.curLength = res.data.list.length;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 切换tab
		 */
		handleChange(type) {
			this.isAll = false;
			this.type = type;
			this.selected = [];

			this.$refs.tableTarget[indexMap[this.type]].$refs.tableTarget.selectAll(false);
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/sea/black', { ...query }));
		},
		/**
		 * 更新每页显示的条数
		 */
		handleChangePageSize() {
			this.isAll = false;
			this.selected = [];
			this.$refs.tableTarget[indexMap[this.type]].$refs.tableTarget.selectAll(false);
			this.$store.commit('SALE_SEA_BLACK_LIST_RESET', { type: this.type });
		},
		/**
		 * 全选
		 */
		handleIsAll(val) {
			this.$refs.tableTarget[indexMap[this.type]].$refs.tableTarget.selectAll(val);
		},
		/**
		 * 批量确认黑名单
		 */
		handleMultiConfirm() {
			let { query: { page } } = getParseUrl();

			const customer_ids = this.selected.map(_item => {
				return _item.customer_id;
			});

			if (customer_ids.length) {
				Confirm.popup({
					title: '确认黑名单',
					msg: '将选择的客户加入黑名单后，该资料将不在公海展示，确认加入？'
				}).then(() => {
					this.$request({
						url: '_SALE_SEA_BLACK_CONFIRM_POST',
						type: "POST",
						loading: false,
						param: {
							customer_id: customer_ids
						},
						autoTip: true
					}).then(() => {
						this.$store.commit('SALE_SEA_BLACK_LIST_RESET', { type: this.type });
						this.$nextTick(() => {
							if (!(this.curLength - customer_ids.length)) {
								this.$refs.tableTarget[indexMap[this.type]].currentPage = +page - 1;
								this.$refs.tableTarget[indexMap[this.type]].handleChange(+page - 1);
							}
						});
					});
				}).catch(error => {
					error && console.error(error);
				});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
		/**
		 * 批量删除黑名单
		 */
		handleMultiDel() {
			let { query: { page } } = getParseUrl();

			const recycle_ids = this.selected.map(_item => {
				return _item.recycle_id;
			});

			if (recycle_ids.length) {
				Confirm.popup({
					title: '删除黑名单',
					msg: '是否确认删除？'
				}).then(() => {
					this.$request({
						url: '_SALE_SEA_BLACK_DELETE_POST',
						type: "POST",
						loading: false,
						param: {
							recycle_ids
						},
						autoTip: true
					}).then(() => {
						this.$store.commit('SALE_SEA_BLACK_LIST_RESET', { type: this.type });
						this.$nextTick(() => {
							if (!(this.curLength - recycle_ids.length)) {
								this.$refs.tableTarget[indexMap[this.type]].currentPage = +page - 1;
								this.$refs.tableTarget[indexMap[this.type]].handleChange(+page - 1);
							}
						});
					});
				}).catch(error => {
					error && console.error(error);
				});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		}
	}
};

</script>

<style lang="scss">
.v-sale-black-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
