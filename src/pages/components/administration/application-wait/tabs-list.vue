<template>
	<div class="oa-application-wait-table">
		<i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			@on-click="handleChange">
			<i-tab-pane
				v-for="(item, index) in tabs"
				:key="item.value"
				:label="item.label + count[index]"
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
					class="v-hr-employee-relation-try-list"
					mode="table"
					@page-change="handlePageChange"
					@page-size-change="handleChangePageSize"
					@selection-change="handleSelectionChange"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>

</template>

<script>
import lodash from 'lodash';
import { Button, Checkbox, Tabs, TabPane } from "iview";
import { Paging } from "wya-vc";
import checkAll from '@extends/mixins/checkAll';
import { getParseUrl, getHashUrl } from "@utils/utils";
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
// item
import item from "./item";

export default {
	name: "oa-application-wait-table",
	components: {
		"vc-paging": Paging,
		'i-button': Button,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			filter: true, tabs: true, footer: true
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: (query.type || "0") + '', // 同tabs下的value
			current: {},
			tabs: [
				{ label: "待我审核", value: "0" },
				{ label: "待行政确认", value: "1" },
				{ label: "处理中", value: "2" },
				{ label: "待评价", value: "3" },
				{ label: "已完成", value: "4" },
				{ label: "未通过", value: "5" }
			],
			count: [0, 0, 0, 0, 0, 0],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.administrationApplicationWait.listInfo;
		},
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: "ADMINISTRATION_APPLICATION_WAIT_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
				loading: false
			}).then(res => {
				this.count = [
					res.data.mine_audit_count, 
					res.data.is_logistics_verify_count, 
					res.data.being_processed_count, 
					res.data.evaluated_count, 
					res.data.is_finished_count, 
					res.data.not_pass_count
				];
				this.resetType('0', this.count, '/administration/application/wait');
			}).catch(error => {});
		},
		handleChange(type) {
			if (this.type !== type) {
				this.type = type;
				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					type,
					fixPosition: false,
					page: this.current[type]
				};
				this.$router.replace(
					getHashUrl("/administration/application/wait", { ...query })
				);
			}
		},
		handleChangePageSize() {
			this.$store.commit("ADMINISTRATION_APPLICATION_WAIT_LIST_INIT");
		},
	}
};
</script>

<style lang="scss">
.oa-application-wait-table{
	.vc-paging .__footer {
		width: 100% !important;
	}
}
</style>
