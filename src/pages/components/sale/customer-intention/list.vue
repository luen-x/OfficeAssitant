<template>
	<div class="v-customer-intention-list">
		<vc-paging
			ref="tableTarget"
			:columns="columnsShow"
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight, highlightRow: true,rowClassName:getRowClassName, }"
			:page-opts="{showTotal: true,showSizer: true,showElevator: true,placement: 'top',pageSizeOpts: [10, 20, 30]}"
			mode="table"
			class="g-m-t-20 "
			@row-click="handleOpenDrawer"
			@page-change="handlePageChange"
			@page-size-change="handleChangePageSize"
			@selection-change="handleSelectionChange"
		>
			<!-- 只要有我的客户的指派权限就展示勾选框 -->
			<div v-if="$auth[402] || $auth[1678]" slot="extra" class="g-flex-ac">
				<i-checkbox v-model="isAll" @on-change="handleIsAll">全选</i-checkbox>
				<i-button v-if="$auth[402]" @click="handleChoose">指派</i-button>
				<i-button v-if="$auth[1678]" class="g-m-l-10" @click="handleDrawBack">归还</i-button>
			</div>
		</vc-paging>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import switchRow from '@extends/mixins/switchRow';
import callService from "@components/sale/call-manage/call/service";
import { services } from 	'@stores/services/sale';
import { Distribute } from '../_common/customer/distribute';
import { ChooseStaff } from '../_common/customer/choose-staff';
import item from './item';
import { getAuth } from '../_common/util';
import { Confirm } from '../../_common/confirm/confirm.vue';

export default {
	name: 'vue-env2-table',
	components: {
		'vc-paging': Paging,
		'i-button': Button,
		'i-checkbox': Checkbox,
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			nav2: false,
			tab: false,
			extra: 28,
		}),
		switchRow,
		services.coinConfig()
	],
	data() {
		const { query } = this.$route;
		return {

		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerIntention.listInfo;
		},
		queryLength() {
			return Object.keys(this.$route.query).length;
		},
		columnsShow() {
			const columnsShow = this.$store.state.saleCustomerIntention.title[this.$route.query.type || '1'].title_show.map(cloShow => {
				const result = this.columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key：" + cloShow.key);
				return result; 
			}).filter(Boolean);

			if (this.$auth[402] || this.$auth[1678]) {
				columnsShow.splice(0, 0, {
					type: "selection",
					width: 50,
					fixed: "left",
					className: "g-pd-l-10"
				});
			}
			return columnsShow;
		}
	},
	created() {
		callService.callEmitter.on('add-record', this.handleResetCur, this);
		this.loadTableTitle();
	},
	destroyed() {
		callService.callEmitter.off('add-record', this.handleResetCur, this);
	},
	methods: {
		getAuth(bool, num1, num2) {
			return getAuth(bool, num1, num2);
		},
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			this.openIndex = -1;
			let { query = {} } = getParseUrl();
			return this.request({
				url: "SALE_CUSTOMER_INTENTION_LIST_GET",
				type: 'GET',
				param: {
					is_own: this.$auth[375] ? '2' : '1',
					...query,
					page,
					pageSize
				},
				emptyToLine: true
			}).then((res) => {
				if (query.customer_id) {
					setTimeout(() => {
						const index = res.data.list.findIndex(item_ => {
							return item_.customer_id == this.$route.query.customer_id;
						});
						if (index > -1) {
							this.$refs.tableTarget.$refs.tableTarget.clickCurrentRow(index);
							this.openIndex = index;
						}
					}, 1000);
				}

			}).catch((error) => {

			});
		},
		handleSearch(query = {}) {
			this.$router.replace(getHashUrl(
				'/sale/customer/intention',
				{
					...this.$route.query,
					...query
				}
			));
			this.$store.commit('SALE_CUSTOMER_INTENTION_LIST_INIT');
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('SALE_CUSTOMER_INTENTION_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleChoose() {
			if (this.selected.length == 0) {
				this.$Message.warning("请选择要指派的客户");
				return;
			}
			// 如果没有全部客户的指派权限，查看勾选的客户中是否有不是自己的，如果有则提示
			if (!this.$auth[391] && this.selected.find(_item => _item.is_own != '1')) {
				this.$Message.error("你没有全部客户的指派权限，只能指派自己的客户");
				return;
			}
			const customerIds = this.selected.map(_item => {
				return _item.customer_id;
			});
			Distribute.popup({
				customerIds,
			}).then(() => {
				// 进行指派
				this.handleResetCur();
				this.isAll = false;
			}).catch(() => {
			});
			// ChooseStaff.popup({
			// 	customer_ids: customerIds,
			// 	type: 'distribute',
			// 	title: "选择指派人"
			// }).then(() => {
			// 	// 进行指派
			// 	this.handleResetCur();
			// 	this.isAll = false;
			// }).catch(() => {
			// });

		},
		loadTableTitle() {
			this.$request({
				url: "_SALE_CUSTOMER_LIST_SORT_CONFIG_GET",
				type: "GET",
				param: {
					type: this.type || '1',
					table_type: 1
				},
				loading: false,
			}).then(res => {
				this.$store.commit('SALE_CUSTOMER_INTENTION_TITLE_CHANGE', { ...res.data, type: this.type || '1' });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		getRowClassName(row, index) {
			if (row.sort) {
				return '__top-row';
			} else {
				return '';
			}
		},
		handleDrawBack() {
			if (this.selected.length == 0) {
				this.$Message.warning("请选择要归还的客户");
				return;
			}
			Confirm.popup({
				title: '归还',
				msg: '确认将选中的' + this.selected.length + '个客户归还公海吗？'
			}).then(() => {
				this.$request({
					url: "_SALE_INTENTION_BACK_SEA_POST",
					type: "POST",
					param: {
						own_ids: this.selected.map(i => i.own_id)
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(e => e && console.error(e));

		}


	}
};
</script>

<style lang="scss">
.v-customer-intention-list{
	.ivu-table-cell{
		white-space: nowrap;
		padding-left: 8px;
		padding-right: 8px;
	}
	._split-bar {
		position:relative;
		display:inline-block;
		margin: 0 10px;
		width:1px;
		height:12px;
		background:rgba(232,232,232,1);
		top:2px

	}
}
</style>
