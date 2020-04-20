<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		class="g-tabs-card"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item, i) in tabs"
			:key="item.value"
			:label="item.label + tabsNum[i]"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-content-notice-inform-list"
				mode="table"
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
					<i-button @click="handleBatchDel">批量删除</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import lodash from 'lodash';
import { Tabs, TabPane, Button, Checkbox } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import { PModalDelete } from './popup/delete';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		'i-checkbox': Checkbox
	},
	mixins: [
		item,
		checkAll,
		tableHeight({ nav1: false, nav2: false }),
		autoFix()
	],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '全部', value: '0' },
				{ label: '已开启', value: '1' },
				{ label: '已关闭', value: '2' },
				{ label: '已失效', value: '3' }
			],
			tabsNum: [0, 0, 0, 0],
			count_open: '' // tabs已开启数量，单独拿出监听改变发送mitutation 控制新增通知按钮（<10）
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentNoticeInform.listInfo;
		},
	},
	watch: {
		count_open(newVal, oldVal) {
			newVal !== oldVal && this.$store.commit('CONTENT_NOTICE_INFORM_COUNT_OPEN', {
				count_open: newVal
			});
		},
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'CONTENT_NOTICE_INFORM_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then(({ data }) => {
				this.count_open = data.count_open;
				this.tabsNum = [data.count_all, data.count_open, data.count_close, data.count_invalid];
				this.resetType('0', this.tabsNum, '/content/notice/inform');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			if (this.type !== type) {
				this.isAll = false;
				this.handleIsAll(false);
				this.type = type;

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					type,
					fixPosition: false,
					page: this.current[type]
				};
				this.$router.replace(getHashUrl('/content/notice/inform', { ...query }));
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('CONTENT_NOTICE_INFORM_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type].$refs.tableTarget.selectAll(val);
		},
		handleBatchDel() {
			if (!this.selected.length) {
				this.$Message.warning('请至少选择一项进行操作！');
				return;
			}

			PModalDelete.popup({
				data: this.selected
			}).then(res => {
				this.handleResetCur();
			});
		},
	}
};
</script>