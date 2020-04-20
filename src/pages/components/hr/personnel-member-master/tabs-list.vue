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
			:label="`${item.label} ${count[index]}`"
			:name="item.value"
		>
			<vc-paging
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
				class="v-hr-personnel-member-master-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Paging, Copy } from "wya-vc";
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import { tableHeight } from "@extends/mixins/table";
import { M_HR_URL } from "@constants/constants";
import { autoFix } from '@extends/mixins/auto-fix';

// item
import item from "./item";

export default {
	name: "hr-personnel-member-master",
	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane
	},
	mixins: [
		item,
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
			data: {},
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{
					label: "待我审核",
					value: "1"
				},
				{
					label: "待三立学府确认",
					value: "2"
				},
				{
					label: "评选中",
					value: "3"
				},
				{
					label: "已通过",
					value: "4"
				},
				{
					label: "未通过",
					value: "5"
				}
			],
			count: [0, 0, 0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrPersonnelMemberMaster.listInfo;
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

	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			const ids = getItem(`firstDepartId_${_global.version}`).res.data;
			return this.request({
				url: "HR_PERSONNEL_MEMBER_MASTER_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					first_depart_id: query.first_depart_id || ids.sale || this.$global.staff.first_depart
				}
			}).then(res => {
				this.count = [
					+res.data.audit_count, 
					+res.data.train_confirm_count,
					+res.data.selecting_count,
					+res.data.passed_count,
					+res.data.not_pass_count
				];	
				this.resetType('1', this.count, '/hr/personnel/member/master');
			}).catch(error => {});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(
				getHashUrl("/hr/personnel/member/master", { ...query })
			);
		},
		handleChangePageSize() {
			this.$store.commit("HR_PERSONNEL_MEMBER_MASTER_LIST_INIT");
		},
	}
};
</script>

<style lang="scss">
</style>
