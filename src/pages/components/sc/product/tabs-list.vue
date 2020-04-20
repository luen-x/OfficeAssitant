<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		class="g-tabs-card v-sc-product-table"
		@on-click="handleChange"
	>
		<!-- <div slot="extra" style="margin-top: 7px;">
			<span class="g-c-black4">产品制作的流程</span>
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
				class="v-sc-product-list"
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
					<i-button v-if="$auth[1050]" @click="handleAddLabel">添加标签</i-button>
					<i-button v-if="$auth[1050]" class="g-m-l-10" @click="handleDelLabel">删除标签</i-button>
					<i-button v-if="$auth[1064]" class="g-m-l-10" @click="handleIsTop('1')">置顶展示</i-button>
					<i-button v-if="$auth[1064]" class="g-m-l-10" @click="handleIsTop('2')">取消置顶</i-button>

					<i-dropdown v-if="$auth[1251]" class="g-m-l-10">
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
							<i-dropdownitem v-if="$auth[1252]">
								<span @click="handleSendEmail">发送邮件</span>
							</i-dropdownitem>
							<i-dropdownitem v-if="$auth[1253]">
								<span @click="handleLookEmail">查看发件箱</span>
							</i-dropdownitem>
						</i-dropdownmenu>
					</i-dropdown>

					<i-button
						v-if="$auth[1480]"
						class="g-m-l-10" 
						@click="handleWorkRegister"
					>
						工作登记
					</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Paging } from "wya-vc";
import { getParseUrl, getHashUrl, setItem, getItem } from "@utils/utils";
import { tableHeight } from '@extends/mixins/table';
import { VideoModal } from '@components/_common/video-modal/video-modal';
import checkAll from '@extends/mixins/checkAll';
import { autoFix } from '@extends/mixins/auto-fix';
import { Confirm } from "@components/_common/confirm/confirm";
import item from "./item";
import { AddLabelModal } from "../_common/table-modal/add-label";
import { WorkRegister } from "../customer-cooperate-distribute/popup/work-register";
import { DetailDrawer } from "./popup/detail.vue";

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
				{ label: "待完成", value: "1" },
				{ label: "已完成", value: "2" },
				{ label: "已失效", value: "3" }
			],
			flag: true
		};
	},

	computed: {
		listInfo() {
			return this.$store.state.scProduct.listInfo;
		}
	},

	mounted() {
		this.listLoadData();
		this.searchLoadData();
	},

	created() {
		this.$store.commit('SC_PRODUCT_SELECTED_TAB', this.type);
	},

	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			let { query = {} } = getParseUrl();
			this.selected = [];

			return this.request({
				url: "SC_PRODUCT_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				}
			}).then(res => {
				if (this.$route.query.flag && this.$route.query.project_id) {
					DetailDrawer.popup({
						type: this.type,
						contract_id: Number(res.data.list[0].contract_id),
						project_id: Number(res.data.list[0].project_id),
						product_id: Number(res.data.list[0].product_id),
						contract_company_id: Number(res.data.list[0].contract_company_id),
						product: res.data.list[0].product,
						contract_num: res.data.list[0].contract_num,
						contract_type: Number(res.data.list[0].contract_type),
						tab: "productProgress"
					}).then(ress => {
						ress && this.$store.commit("SC_PRODUCT_LIST_RESET", { type: this.type });
					});
				}
				
				this.resetType('1', this.listInfo.count, '/sc/product');
			}).catch(error => {});
		},
		
		handleChange(type) {
			this.type = type;
			this.handleIsAll(false);

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			delete query.make_id;
			delete query.project_id;
			delete query.jump;

			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl("/sc/product", { ...query }));
		},

		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit("SC_PRODUCT_LIST_INIT");
		},

		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},

		// 增加标签
		handleAddLabel() {
			if (!this.selected.length) {
				this.$Message.warning("请选择具体的数据再进行操作哦~");

				return;
			}

			let project_ids = [];

			this.selected.forEach(element => {
				project_ids.push(element.project_id);
			});

			AddLabelModal.popup({
				flag: 2,
				project_ids,
				tab: this.type
			}).then((res) => {
				this.isAll = false;
				
				this.$store.commit("SC_PRODUCT_LIST_RESET", {
					type: ""
				});
			}).catch(error => {
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
					res && this.$store.commit("SC_PRODUCT_LIST_RESET", {
						type: ""
					});
				}).catch(error => {
					this.$Message.warning(error.msg);
				});
			}).catch(error => {});
		},

		// 置顶展示
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
						tab: 0
					}
				}).then(res => {
					this.$Message.success(res.msg);
					res && this.$store.commit("SC_PRODUCT_LIST_RESET", {
						type: ""
					});
				}).catch(error => {
					this.$Message.warning(error.msg);
				});
			}).catch(error => {});
		},

		handleWatchVideo() {
			VideoModal.popup({
				urlType: 'SC_PRODUCT_VIDEO',
				title: '产品制作的流程'
			}).then((res) => {

			});
		},

		loadTableTitle(type) {
			return this.$request({
				url: "_SC_CUSTOMER_COOPERATE_EDIT_CUSTOMER_LABEL_SETTING_GET",
				type: "GET",
				param: {
					type: type || "1",
					scenario: 2
				},
				loading: false,
			}).then(res => {
				this.$store.commit("SC_PRODUCT_TITLE_CHANGE", { ...res.data, type: type || '1' });
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
				path: "/sc/product/send/email",
				query: {
					flag: 2
				}
			});
		},

		// 查看邮件
		handleLookEmail() {
			this.$router.push({
				path: "/sc/product/outbox",
				query: {
					flag: 2
				}
			});
		},

		listLoadData() {
			return this.$request({
				url: "_SC_CUSTOMER_COOPERATE_EDIT_CUSTOMER_LABEL_SETTING_GET",
				type: "GET",
				param: {
					scenario: 2,
					label: "sort"
				},
				loading: false
			}).then(res => {
				this.$store.commit('SC_PRODUCT_LIST_SORT', res.data);
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
					scenario: 2,
					label: "search"
				},
				loading: false
			}).then(res => {
				this.$store.commit('SC_PRODUCT_LIST_SEARCH', res.data);
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		// 工作登记
		handleWorkRegister() {
			let work = {};

			if (this.selected.length > 1) {
				this.$Message.warning("只能选择一条数据提交工作数据哦~");

				return;
			} else if (this.selected.length === 1) {
				work = {
					project_id: this.selected[0].project_id,
					contract_id: this.selected[0].contract_id,
					contract_company_id: this.selected[0].contract_company_id,
					product_id: this.selected[0].product_id,
					contract_company_name: this.selected[0].company
				};
			}

			WorkRegister.popup({
				work
			}).then(res => {
				this.$store.commit("SC_PRODUCT_LIST_RESET", { type: this.type });
			});
		}
	}
};
</script>

<style lang="scss">
	.v-sc-product-table{
		.__select:hover{
			color: #2296f9 !important;
		}
	}
</style>