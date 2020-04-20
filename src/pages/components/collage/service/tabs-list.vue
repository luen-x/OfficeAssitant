<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item,index) in tabs"
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
				class="v-collage-service-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
				@row-click="handleOpenDrawer"
				@sort-change="handleSortChange"
			>
				<div slot="extra" class="g-flex-ac">
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button class="g-m-l-10" @click="handleIsTop('1')">置顶展示</i-button>
					<i-button class="g-m-l-10" @click="handleIsTop('2')">取消置顶</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Button, Checkbox } from "iview";
import { Paging } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import checkAll from "@extends/mixins/checkAll";
import { tableHeight } from "@extends/mixins/table";
import { autoFix } from "@extends/mixins/auto-fix";
import { Confirm } from "@components/_common/confirm/confirm";
import item from "./item";

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
			footer: true,
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
				{ label: "已完成", value: "2" }
			],
			sort: ""
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.collageService.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();

			return this.request({
				url: "COLLAGE_SERVICE_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType("1", this.listInfo.count, "/collage/service");
			}).catch((error) => {
				this.$Message.error(error.msg);
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

				this.$router.replace(getHashUrl('/collage/service', { ...query }));
			}
		},
		// 点击全选
		handleIsAll(val) {
			this.$refs[`table${this.type}`][0].$refs.tableTarget.selectAll(val);
		},
		handleChangePageSize() {
			this.$store.commit('COLLAGE_SERVICE_LIST_INIT');
		},
		getRowClassName(row, index) {
			if (Number(row.sort) === 1) {
				return "__top-row";
			} else {
				return "";
			}
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_COLLAGE_BUSINESS_TABLE_INFO_GET",
				type: "GET",
				param: {
					type: type || "1",
					scenario: 2
				},
				loading: false,
			}).then(res => {
				this.$store.commit('COLLAGE_SERVICE_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleSortChange(obj) {
			this.sort = "";
			let { query = {} } = getParseUrl();

			if (obj.order === "asc") {
				this.sort = `${obj.key},4`;
			} else if (obj.order === "desc") {
				this.sort = `${obj.key},3`;
			} else {
				this.sort = "";
			}

			this.handleSearch();
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/collage/service', 
				{ 
					...this.$route.query, 
					fixPosition: false,
					sort_field: this.sort ? this.sort.split(",")[0] : "",
					sort_method: this.sort ? this.sort.split(",")[1] : ""

				}
			));
			
			this.$store.commit('COLLAGE_SERVICE_LIST_INIT');
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
					res && this.$store.commit('COLLAGE_SERVICE_LIST_RESET', {
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