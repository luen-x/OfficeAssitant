<template>
	<div class="v-sale-sea-archive-list">
		<div class="g-tr g-pd-lr-10 g-pd-t-10 g-pd-b-5" style="margin-bottom: -20px;"> 
			<span class="_split-bar"/>
			<span class="g-operation-hover" @click="handleChangeTableTitle" >选择表头</span> 
		</div>
		<vc-paging
			ref="tableTarget"
			:columns="columnsShow"
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight, highlightRow: true}"
			:page-opts="{
				showTotal: true,
				showSizer: false,
				showElevator: true,
				placement: 'top',
				pageSizeOpts: [20], 
			}"
			:auth="{pageSize: false}"
			mode="table"
			class="g-m-t-20"
			@page-change="handlePageChange"
			@page-size-change="handleChangePageSize"
			@selection-change="handleSelectionChange"
			@row-click="handleOpenDrawer"
		>
			<div v-if="$auth[479]" slot="extra" class="g-flex-ac">
				<i-checkbox
					v-model="isAll"
					@on-change="handleIsAll"
				>
					全选
				</i-checkbox>
				<i-button
					@click="handleAdd"
				>
					添加进白名单
				</i-button>
			</div>

			<div v-if="$auth[474] && !$auth[475]" slot="page">
				<i-button
					v-if="targetPage == 1"
					type="primary"
					class="g-m-l-10"
					@click="handlePage('1')"
				>
					首页
				</i-button>
				<i-button
					v-else
					class="g-m-l-10"
					@click="handlePage('1')"
				>
					首页
				</i-button>
				<i-button
					:disabled="!(totalPage > 1 && targetPage > 1)"
					class="g-m-l-10"
					@click="handlePage('-1')"
				>
					上一页
				</i-button>
				<i-button
					:disabled="!(totalPage > 10 && targetPage > 10)"
					class="g-m-l-10"
					@click="handlePage('-10')"
				>
					上10页
				</i-button>
				<i-button
					:disabled="!(totalPage > 100 && targetPage > 100)"
					class="g-m-l-10"
					@click="handlePage('-100')"
				>
					上100页
				</i-button>
				<i-button
					:disabled="!(totalPage > 100 && (totalPage - targetPage) >= 100)"
					class="g-m-l-10"
					@click="handlePage('+100')"
				>
					下100页
				</i-button>
				<i-button
					:disabled="!(totalPage > 10 && (totalPage - targetPage) >= 10)"
					class="g-m-l-10"
					@click="handlePage('+10')"
				>
					下10页
				</i-button>
				<i-button
					:disabled="!(totalPage > 1 && (totalPage - targetPage) >= 1)"
					class="g-m-l-10"
					@click="handlePage('+1')"
				>
					下一页
				</i-button>
			</div>
		</vc-paging>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Checkbox, Button } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import switchRow from '@extends/mixins/switchRow';
import { TableTitle } from '@components/_common/table-title/table-title';
import { Confirm } from '@components/_common/confirm/confirm';
// item
import item from './item';

export default {
	name: 'oa-sea-archive-list',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			nav1: true,
			nav2: false,
			tab: false,
			extra: 45
		}),
		switchRow
	],
	data() {
		const { query } = this.$route;

		return {
			targetPage: Number(this.$route.query.page) || 1,
			totalPage: '',
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleSeaArchive.listInfo;
		},
		page() {
			return this.$route.query.page || 1;
		},
		columnsShow() {
			const columnsShow = this.$store.state.saleSeaArchive.title[this.$route.query.type || '1'].title_show.map(cloShow => {
				const result = this.columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key：" + cloShow.key);
				return result; 
			}).filter(Boolean);

			if (this.$auth[479]) {
				columnsShow.splice(0, 0, {
					type: "selection",
					width: 50,
					fixed: "left"
				});
			}
			return columnsShow;
		}
	},
	created() {
		this.loadTableTitle();
		this.$vc.on('SALE_SEA_CUSTOMER_UPDATE_LIST_SILENCE', this.updateListSilence);
	},
	beforeDestroy() {
		this.$vc.off('SALE_SEA_CUSTOMER_UPDATE_LIST_SILENCE');

	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			this.openIndex = -1;
			let { query = {} } = getParseUrl();

			if (page == 1) {
				this.targetPage = 1;
			}
			
			return this.request({
				url: 'SALE_SEA_ARCHIVE_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					...query,
					page,
					pageSize,
				},
				autoTip: false
			}).then((res) => {
				this.totalPage = res.data.totalPage;
				this.$store.commit("SALE_SEA_ARCHIVE_INDUSTRY_LIST_UPDATE", res.data.industry_list || []);
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 加载自定义表头
		 */
		loadTableTitle() {
			this.$request({
				url: "_SALE_CUSTOMER_LIST_SORT_CONFIG_GET",
				type: "GET",
				param: {
					type: this.type || '1',
					table_type: 2
				},
				loading: false,
			}).then(res => {
				this.$store.commit('SALE_SEA_ARCHIVE_TITLE_CHANGE', { ...res.data, type: this.type || '1' });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		/**
		 * 更新每页加载的条数
		 */
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit("SALE_SEA_ARCHIVE_LIST_INIT");
		},
		// 点击全选
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		/**
		 * 添加进白名单
		 */
		handleAdd() {
			const selectedRows = this.$refs.tableTarget.$refs.tableTarget.getSelection();
			const customer_ids = selectedRows.map(_item => {
				return _item.customer_id;
			});

			if (customer_ids.length) {
				Confirm.popup({
					title: '添加进白名单',
					msg: '确定将该用户添加进白名单吗！'
				}).then(() => {
					this.$request({
						url: '_SALE_SEA_WHITE_ADD_POST',
						type: "POST",
						loading: false,
						param: {
							type: 1,
							customer_ids
						},
						autoTip: true
					}).then(() => {
						this.isAll = false;
						this.$store.commit('SALE_SEA_ARCHIVE_LIST_INIT');
					});
				}).catch(error => {
					error && console.error(error);
				});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
		/**
		 * 分页
		 */
		handlePage(str) {
			switch (str) {
				case '1':
					this.targetPage = 1;
					break;
				case '-1':
					this.targetPage -= 1;
					break;
				case '-10':
					this.targetPage -= 10;
					break;
				case '-100':
					this.targetPage -= 100;
					break;
				case '+100':
					this.targetPage += 100;
					break;
				case '+10':
					this.targetPage += 10;
					break;
				case '+1':
					this.targetPage += 1;
					break;
				default:
					break;
			}

			if (this.targetPage < 1) {
				this.targetPage = 1;
			}

			this.$refs.tableTarget.handleChange(this.targetPage);
		},
		/**
		 * 选择表头
		 */
		handleChangeTableTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.saleSeaArchive.title[this.$route.query.type || '1'];
			TableTitle.popup({ 
				dataShow, 
				dataHide,
				saveUrl: '_SALE_CUSTOMER_LIST_SORT_CONFIG_SAVE_POST',
				mutation: 'SALE_SEA_ARCHIVE_TITLE_CHANGE',
				type: this.$route.query.type || '1',
				params: { table_type: 2 }
			}).then(() => {
				this.$store.commit("SALE_SEA_ARCHIVE_LIST_INIT", {
					type: this.$route.query.type || '1'
				});
			}).catch(error => {
				error && console.error(error);
			});
		},
		updateListSilence() {
			this.isAll = false;
			this.selected = [];
			this.openIndex = -1;
			let { query = {} } = getParseUrl();
			const page = query.page || 1;
			const pageSize = 20;

			if (page == 1) {
				this.targetPage = 1;
			}
			this.$request({
				url: 'SALE_SEA_ARCHIVE_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					...query,
					page,
					pageSize
				},
				autoTip: false
			}).then(res => {
				this.$store.commit('_SALE_SEA_ARCHIVE_LIST_RESET_SILENCE', { page, data: res.data });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});	
		}
	}
};

</script>

<style lang="scss">
.v-sale-sea-archive-list {
	._split-bar {
		position:relative;
		display:inline-block;
		margin: 0 10px;
		width:1px;
		height:12px;
		background:rgba(232,232,232,1);
		top:2px;
	}
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
