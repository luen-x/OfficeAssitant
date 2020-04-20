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
				:table-opts="{height: tableHeight}"
				class="v-hr-summary-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@sort-change="handleSortChange"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Paging, Copy } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import { tableHeight } from '@extends/mixins/tableHeight';
import { M_HR_URL } from "@constants/constants";
import { autoFix } from '@extends/mixins/auto-fix';
import { AuditModal } from "./popup/audit.vue";
// item
import item from "./item";

export default {
	name: "oa-table",
	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane
	},
	mixins: [
		item,
		tableHeight({
			nav1: true,
			nav2: false,
			tab: true,
			extra: 0
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;
		return {
			data: {},
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{
					label: "待入职",
					value: "1"
				},
				{
					label: "已入职",
					value: "2"
				}
			],
			count: [0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrSummary.listInfo;
		}
	},
	watch: {
		$route(to, from) {
			if (to.query.type != from.query.type) {
				const { query } = this.$route;
				this.type = String(query.type || "1");
			}
		}
	},
	created() {
		this.$store.commit("HR_SUMMARY_TAB", this.type);
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: "HR_EMPLOYEE_SUMMARY_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				}
			}).then(res => {
				this.count = [+res.data.entring_num, +res.data.entry_num];
				this.resetType('1', this.count, '/hr/employee/summary');
			}).catch(error => {});
		},
		handleChange(type) {
			this.type = type;
			this.loadTableTitle();
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$nextTick(() => {
				this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
			});
			this.$router.replace(
				getHashUrl("/hr/employee/summary", { ...query })
			);
		},
		handleChangePageSize() {
			this.$store.commit("HR_SUMMARY_LIST_INIT");
		},
		handleSortChange(obj) {
			let { query = {} } = getParseUrl();
			if (obj.key === "resume_status") {
				query["order_by_resume_status"] = obj.order === "asc" ? 0 : 1;
				delete query["order_by_ei_status"];
				delete query["order_by_prove_status"];
			}
			if (obj.key === "ei_status") {
				query["order_by_ei_status"] = obj.order === "asc" ? 0 : 1;
				delete query["order_by_resume_status"];
				delete query["order_by_prove_status"];
			}
			if (obj.key === "prove_status") {
				query["order_by_prove_status"] = obj.order === "asc" ? 0 : 1;
				delete query["order_by_resume_status"];
				delete query["order_by_ei_status"];
			}
			this.$router.replace(
				getHashUrl("/hr/employee/summary", { ...query })
			);
			this.$store.commit("HR_SUMMARY_LIST_INIT");
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: type || "1",
					scenario: 5
				},
				loading: false
			}).then(res => {
				this.$store.commit("HR_SUMMARY_TITLE_CHANGE", {
					...res.data,
					type: type || "1"
				});
				return res;
			}).catch(res => {
				this.$Message.error(res.msg);
			});
		}
	}
};
</script>

<style lang="scss">
</style>
