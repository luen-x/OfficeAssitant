<template >
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		class="g-tabs-card"
		@on-click="handleChange"
	>
		<!-- <div slot="extra" class="g-m-t-10">
			<span class="g-c-black4">合作客户与培训的注意事项</span>
			<span class="g-operation" @click="handleWatchVideo">视频教程</span>
		</div> -->

		<i-tab-pane
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="`${item.label} ${listInfo.count[index]}`"
			:name="item.value"
		>
			<vc-paging
				:ref="'table' + item.value"
				:columns="columns[item.value]"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true,rowClassName:getRowClassName}"
				class="v-collage-customer-cooperate-list"
				mode="table"
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
					<i-button class="g-m-l-10" @click="handleIsTop('1')">置顶展示</i-button>
					<i-button class="g-m-lr-10" @click="handleIsTop('2')">取消置顶</i-button>
					<i-button 
						v-if="$route.query.type=='3' && $auth[121]"
						@click="handleAllocate"
					>
						批量分配
					</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import {
	Tabs,
	TabPane,
	Button,
	Checkbox,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Message,
	Tooltip
} from "iview";
import { Paging } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
import { VideoModal } from '@components/_common/video-modal/video-modal';
import { Confirm } from "@components/_common/confirm/confirm";
import item from "./item";
import { AuditModal } from "./popup/audit.vue";
import { ModifyCostModal } from "./popup/modify-cost.vue";
import { DistributionModal } from "../_common/detail/distribution/distribution";

export default {
	name: "oa-table",

	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
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
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: "待审核", value: "1" },
				{ label: "待确认", value: "2" },
				{ label: "待分配", value: "3" },
				{ label: "已分配", value: "4" },
				{ label: "未通过", value: "5" },
				{ label: "已失效", value: "6" }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.collageCustomerCooperate.listInfo;
		}
	},

	created() {
		this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_SELECTED_TAB', this.type);
	},
	
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();

			return this.request({
				url: "COLLAGE_CUSTOMER_COOPERATE_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				}
			}).then(res => {
				this.resetType('1', this.listInfo.count, '/collage/customer/cooperate');
			}).catch(error => {});
		},

		handleChange(type) {
			if (this.type !== type) {
				this.isAll = false;
				this.handleIsAll(false);
				this.type = type;

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					fixPosition: false,
					type,
					page: this.current[type]
				};
				this.$router.replace(
					getHashUrl("/collage/customer/cooperate", { ...query })
				);
			}
		},

		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit("COLLAGE_CUSTOMER_COOPERATE_LIST_INIT");
		},

		// 点击全选
		handleIsAll(val) {
			this.$refs[`table${this.type}`][0].$refs.tableTarget.selectAll(val);
		},

		getRowClassName(row, index) {
			if (Number(row.sort) === 1) {
				return "__top-row";
			} else {
				return "";
			}
		},

		handleAllocate() {
			if (!this.selected.length) {
				Message.warning("请先选择要分配的公司");
				return;
			}

			let arr = [];
			this.selected.map(e => {
				arr.push(e.project_id);
				return;
			});

			DistributionModal.popup({
				project_id: arr
			}).then(res => {
				this.isAll = false;
			}).catch(res => {});
		},

		handleWatchVideo() {
			VideoModal.popup({
				urlType: 'COLLAGE_CUSTOMER_COOPERATE_VIDEO',
				title: '合作客户与培训的注意事项'
			}).then((res) => {

			});
		},

		loadTableTitle(type) {
			return this.$request({
				url: "_COLLAGE_BUSINESS_TABLE_INFO_GET",
				type: "GET",
				param: {
					type: type || "1",
					scenario: 1
				},
				loading: false,
			}).then(res => {
				this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		// 置顶展示/取消置顶
		handleIsTop(top_flag) {
			if (!this.selected.length) {
				this.$Message.warning("请选择具体的数据再进行操作哦~");

				return;
			}

			let project_ids = [];
			let arr = [];
			let brr = [];

			this.selected.forEach(element => {
				project_ids.push(element.project_id);
				Number(element.sort) === 1 ? arr.push(element) : brr.push(element);
			});

			if (arr.length === this.selected.length && top_flag === "1") {
				this.$Message.warning("不能将置顶的数据再次置顶数据哦~");
				return;
			} else if (brr.length === this.selected.length && top_flag === "2") {
				this.$Message.warning("不能将非置顶的数据再次取消置顶数据哦~");
				return;
			}

			let API = top_flag === "1" ? "_COLLAGE_CUSTOMER_COOPERATE_TOP_ADD_POST" : "_COLLAGE_CUSTOMER_COOPERATE_TOP_DEL_POST";

			Confirm.popup({
				title: "温馨提示",
				msg: top_flag === "1" ? "确认要置顶选中的数据？" : "确认要取消置顶选中的数据？"
			}).then(() => {
				this.$request({
					url: API,
					type: 'POST',
					loading: false,
					param: {
						project_ids
					}
				}).then(res => {
					this.$Message.success(res.msg);
					res && this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_LIST_RESET', {
						type: ""
					});
				}).catch(error => {
					this.$Message.warning(error.msg);
				});
			}).catch(error => {});
		}
	}
};
</script>

<style lang="scss">
</style>