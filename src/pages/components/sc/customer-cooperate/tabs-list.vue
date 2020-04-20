<template>
	<i-tabs
		ref="cooperate"
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		class="g-tabs-card v-sc-cooperate-table"
		@on-click="handleChange"
	>
		<!-- <div slot="extra" style="margin-top: 7px;">
			<span class="g-c-black4">合作客户的审批处理与制作分配</span>
			<span class="g-operation" @click="handleWatchVideo">视频教程</span>
		</div> -->

		<i-tab-pane
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="`${item.label} ${listInfo.count[index]}`"
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
				:table-opts="{height: tableHeight, highlightRow: true, rowClassName:getRowClassName}"
				class="v-sc-customer-cooperate-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@page-change="handlePageChange"
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
					<i-button v-if="$auth[266]" @click="handleAddLabel">添加标签</i-button>
					<i-button v-if="$auth[266]" class="g-m-l-10" @click="handleDelLabel">删除标签</i-button>
					<i-button v-if="$auth[268]" class="g-m-l-10" @click="handleIsTop('1')">置顶展示</i-button>
					<i-button v-if="$auth[268]" class="g-m-l-10" @click="handleIsTop('2')">取消置顶</i-button>

					<i-dropdown v-if="$auth[330]" class="g-m-l-10">
						<div @mouseenter="flag = false" @mouseleave="flag = true">
							<i-button class="g-relative">
								发送邮件
								<i
									v-if="flag"
									class="iconfont icon-triangle-down g-fs-12"
									style="cursor: pointer;"
								/>

								<i
									v-else
									class="iconfont icon-triangle-up g-fs-12"
									style="cursor: pointer;"
								/>
							</i-button>
						</div>

						<i-dropdownmenu slot="list">
							<i-dropdownitem v-if="$auth[331]">
								<span @click="handleSendEmail">发送邮件</span>
							</i-dropdownitem>
							<i-dropdownitem v-if="$auth[332]">
								<span @click="handleLookEmail">查看发件箱</span>
							</i-dropdownitem>
						</i-dropdownmenu>
					</i-dropdown>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Paging } from "wya-vc";
import { getParseUrl, getHashUrl, setItem, getItem } from "@utils/utils";
import { tableHeight } from "@extends/mixins/table";
import { VideoModal } from "@components/_common/video-modal/video-modal";
import checkAll from '@extends/mixins/checkAll';
import { autoFix } from '@extends/mixins/auto-fix';
import { Confirm } from "@components/_common/confirm/confirm";
import { AddLabelModal } from "../_common/table-modal/add-label";
// item
import item from "./item";

export default {
	name: "oa-table",

	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-checkbox": Checkbox,
		"i-button": Button,
		"i-dropdown": Dropdown,
		"i-dropdownmenu": DropdownMenu,
		"i-dropdownitem": DropdownItem
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
			flag: true
		};
	},

	computed: {
		listInfo() {
			return this.$store.state.scCustomerCooperate.listInfo;
		}
	},

	created() {
		this.$store.commit('SC_CUSTOMER_COOPERATE_SELECTED_TAB', this.type);
	},

	mounted() {
		this.listLoadData();
		this.searchLoadData();
	},

	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();

			return this.request({
				url: "SC_CUSTOMER_COOPERATE_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				}
			}).then(res => {
				this.resetType('1', this.listInfo.count, '/sc/customer/cooperate');
			}).catch(error => {});
		},

		handleChange(type) {
			this.type = type;
			this.handleIsAll(false);

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync

			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};

			this.$router.replace(
				getHashUrl("/sc/customer/cooperate", { ...query })
			);
		},

		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit("SC_CUSTOMER_COOPERATE_LIST_INIT");
		},

		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},

		handleWatchVideo() {
			VideoModal.popup({
				urlType: 'SC_CUSTOMER_COOPERATE_VIDEO',
				title: '合作客户的审批处理与制作分配'
			}).then((res) => {
			});
		},

		// 添加标签
		handleAddLabel() {
			let project_ids = [];
			
			if (!this.selected.length) {
				this.$Message.warning("请选择具体的数据再进行操作哦~");

				return;
			}

			this.selected.forEach(element => {
				project_ids.push(element.project_id);
			});

			AddLabelModal.popup({
				flag: 1,
				project_ids,
				tab: this.type,
				v: this.selected.length === 1 ? this.selected[0] : ''
			}).then((res) => {
				this.isAll = false;
				
				this.$store.commit("SC_CUSTOMER_COOPERATE_LIST_RESET", {
					type: ""
				});
			}).catch(err => {
			});
		},

		// 删除标签
		handleDelLabel() {
			if (!this.selected.length) {
				this.$Message.warning("请选择具体的数据再进行操作哦~");

				return;
			}

			let project_ids = [];

			this.selected.forEach(element => {
				project_ids.push(element.project_id);
			});

			Confirm.popup({
				title: "温馨提示",
				msg: "确认删除选中的标签？"
			}).then(() => {
				this.$request({
					url: "_SC_CUSTOMER_COOPERATE_TAG_DEL_POST",
					type: 'POST',
					loading: false,
					param: {
						project_ids
					}
				}).then(res => {
					this.$Message.success(res.msg);
					res && this.$store.commit("SC_CUSTOMER_COOPERATE_LIST_RESET", {
						type: ""
					});
				}).catch(error => {
					this.$Message.warning(error.msg);
				});
			}).catch(error => {});
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

			let API = top_flag === "1" ? "_SC_CUSTOMER_COOPERATE_TOP_ADD_POST" : "_SC_CUSTOMER_COOPERATE_TOP_DEL_POST";
			let tab = "";

			if (this.type === "1" || this.type === "2" || this.type === "5") {
				tab = "1";
			} else {
				tab = "0";
			}

			Confirm.popup({
				title: "温馨提示",
				msg: top_flag === "1" ? "确认要置顶选中的数据？" : "确认要取消置顶选中的数据？"
			}).then(() => {
				this.$request({
					url: API,
					type: 'POST',
					loading: false,
					param: {
						project_ids,
						tab
					}
				}).then(res => {
					this.$Message.success(res.msg);
					res && this.$store.commit("SC_CUSTOMER_COOPERATE_LIST_RESET", {
						type: ""
					});
				}).catch(error => {
					this.$Message.warning(error.msg);
				});
			}).catch(error => {});
		},

		listLoadData() {
			return this.$request({
				url: "_SC_CUSTOMER_COOPERATE_EDIT_CUSTOMER_LABEL_SETTING_GET",
				type: "GET",
				param: {
					scenario: 1,
					label: "sort"
				},
				loading: false
			}).then(res => {
				this.$store.commit('SC_CUSTOMER_COOPERATE_LIST_SORT', res.data);
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		searchLoadData() {
			return this.$request({
				url: "_SC_CUSTOMER_COOPERATE_EDIT_CUSTOMER_LABEL_SETTING_GET",
				type: "GET",
				param: {
					scenario: 1,
					label: "search"
				},
				loading: false
			}).then(res => {
				this.$store.commit('SC_CUSTOMER_COOPERATE_LIST_SEARCH', res.data);
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		getRowClassName(row, index) {
			if (Number(row.sort) === 1) {
				return "__top-row";
			} else {
				return "";
			}
		},

		// 发邮件
		handleSendEmail() {
			if (!this.selected.length) {
				this.$Message.warning("请选择具体的数据再进行操作哦~");

				return;
			}

			let contract_data = [];

			this.selected.forEach(element => {
				contract_data.push(element.contract_id);
			});

			setItem(`contract_data_${this.$global.version}`, JSON.stringify(contract_data));
			
			this.$router.push({
				path: "/sc/customer/cooperate/send/email",
				query: {
					flag: 1 // 为1表示从合作客户进入发邮件页面的，为2表示从产品制作进入发邮件页面的
				}
			});
		},

		loadTableTitle(type) {
			return this.$request({
				url: "_SC_CUSTOMER_COOPERATE_EDIT_CUSTOMER_LABEL_SETTING_GET",
				type: "GET",
				param: {
					type: type || '1',
					scenario: 1
				},
				loading: false
			}).then(res => {
				this.$store.commit('SC_CUSTOMER_COOPERATE_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		// 查看邮件
		handleLookEmail() {
			this.$router.push({
				path: "/sc/customer/cooperate/outbox",
				query: {
					flag: 1 // 为1表示从合作客户进入发邮件页面的，为2表示从产品制作进入发邮件页面的
				}
			});
		}
	}
};
</script>

<style lang="scss">
	.v-sc-cooperate-table{
		.__select:hover{
			color: #2296f9 !important;
		}
	}
</style>