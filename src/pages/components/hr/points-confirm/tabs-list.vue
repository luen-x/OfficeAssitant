<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<!-- <div slot="extra" style="margin-top: 7px;">
			<span class="g-c-black4">服务积分的作用与投诉管理</span>
			<span class="g-operation" @click="handleWatchVideo">视频教程</span>
		</div> -->
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label"
			:name="item.value"
		>
			<vc-paging
				ref="selection"
				:columns="getColumns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-hr-points-confirm-list"
				mode="table"
				@row-click="handleOpenDrawer"
				@page-change="handlePageChange" 
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div v-if="(type == '1' || type == '2') && $auth[261]" slot="extra" class="g-flex-ac">
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button @click="handleAllocate">批量分配</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Button, Checkbox, Message } from 'iview';
import { Paging, CreatePortal } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/table';
import { VideoModal } from '@components/_common/video-modal/video-modal';
import { AllocateModal } from './popup/allocate.vue';
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
		tableHeight({
			filter: true,
			tabs: true,
			footer: true
		})
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待分配', value: '1' },
				{ label: '已分配', value: '2' },
				{ label: '待确认', value: '3' },
				{ label: '已确认', value: '4' }
			],
			firstLoad: !query.type,
			count: [0, 0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrPointsPointsConfirm.listInfo;
		},
		isSelectAll: {
			get() {
				const { query } = this.$route;
				const type = String(query.type || "1");
				if (!this.$store.state.hrPointsPointsConfirm.listInfo[type].data['1']) return false;
				return this.selection[type].length === this.$store.state.hrPointsPointsConfirm.listInfo[type].data['1'].length;
			},
			set(val) {

			}
		}
	},
	created() {
		const { query } = this.$route;
		this.tabs = this.$auth[261] ? [
			{ label: '待分配', value: '1' },
			{ label: '已分配', value: '2' },
			{ label: '待确认', value: '3' },
			{ label: '已确认', value: '4' }
		] : [
			{ label: '已分配', value: '2' },
			{ label: '待确认', value: '3' },
			{ label: '已确认', value: '4' }
		];
		this.type = this.$auth[261] ? (query.type || "1") : (query.type || "2");
	},
	methods: {
		handleWatchVideo() {
			VideoModal.popup({
				urlType: 'HR_POINTS_CONFIRM_VIDEO',
				title: '服务积分的作用与投诉管理'
			}).then((res) => {

			});
		},
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_POINTS_CONFIRM_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [
					+res.data.wait_count, 
					+res.data.assigned_count, 
					+res.data.wait_confirm_count,
					+res.data.confirmed_count
				];
				if (this.firstLoad) {
					if (this.count.findIndex(num => num) != -1) {
						this.type = this.count.findIndex(num => num) + 1 + '';
					}
					this.firstLoad = false;
				}
				if (this.$auth[261]) {
					this.tabs = [
						{ label: `待分配${res.data.wait_count}`, value: '1' },
						{ label: `已分配${res.data.assigned_count}`, value: '2' },
						{ label: `待确认${res.data.wait_confirm_count}`, value: '3' },
						{ label: `已确认${res.data.confirmed_count}`, value: '4' }
					];
				} else {
					this.type = String(query.type || "3");
					this.tabs = [
						{ label: `已分配${res.data.assigned_count}`, value: '2' },
						{ label: `待确认${res.data.wait_confirm_count}`, value: '3' },
						{ label: `已确认${res.data.confirmed_count}`, value: '4' }
					];
				}
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			if (this.type !== type) {
				this.isAll = false;
				this.handleIsAll(false);
				this.type = type;
				this.firstLoad = false;
				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					type,
					page: this.current[type]
				};
				this.$router.replace(getHashUrl('/hr/points/confirm', { ...query }));
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_POINTS_CONFIRM_LIST_INIT');
		},
		// 点击全选
		handleIsAll(val) {
			this.$refs.selection[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleAllocate() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要分配的客户');
				return;
			}
			let arr = [];
			this.selected.map(e => {
				let obj = {};
				obj.service_staff_id = e.staff_id;
				obj.contract_company_id = e.contract_company_id;
				arr.push(obj);
				return;
			});
			AllocateModal.popup({
				customer_info: arr,
			}).then((res) => {
				this.isAll = false;
				this.$store.commit('HR_POINTS_CONFIRM_LIST_INIT');
			}).catch((res) => {

			});
		},
	}
};

</script>

<style lang="scss">

</style>
