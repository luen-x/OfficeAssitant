<template>
	<div class="oa-application-mine-table">
		<i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			@on-click="handleChange">
			<i-tab-pane
				v-for="(item,index) in tabs"
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
					:history="true"
					:load-data="loadData"
					:current.sync="current[item.value]"
					:table-opts="{height: tableHeight}"
					class="v-administration-application-mine-list"
					mode="table"
					@page-change="handlePageChange"
					@page-size-change="handleChangePageSize"
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
import { setTimeout } from 'timers';
import item from "./item";

export default {
	name: "oa-application-mine-table",
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
		let tabs = [
			{ label: "待上级审核", value: "0" },
			{ label: "待行政确认", value: "1" },
			{ label: "处理中", value: "2" },
			{ label: "待评价", value: "3" },
			{ label: "已完成", value: "4" },
			{ label: "未通过", value: "5" }
		];
		let count = [0, 0, 0, 0, 0, 0];
		let showStatus = '0';
		if (this.$global.staff.charge == 1 || !(this.$global.staff.depart_lowest == 1 && this.$global.staff.depart_is_charge == 0)) {
			tabs.splice(0, 1);
			count.splice(0, 1);
			showStatus = '1';
		}
		return {
			type: (query.type || showStatus) + '', // 同tabs下的value
			current: {},
			manager: true,
			tabs,
			showStatus,
			count
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.administrationApplicationMine.listInfo;
		},
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: "ADMINISTRATION_APPLICATION_MINE_LIST_GET",
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
					res.data.superior_audit_count, 
					res.data.is_logistics_verify_count, 
					res.data.being_processed_count, 
					res.data.evaluated_count, 
					res.data.is_finished_count, 
					res.data.not_pass_count
				];
				this.showStatus === '1' && this.count.splice(0, 1);
				this.resetType('1', this.count, '/administration/application/mine');
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
					getHashUrl("/administration/application/mine", { ...query })
				);
			}
		},
		handleChangePageSize() {
			this.$store.commit("ADMINISTRATION_APPLICATION_MINE_LIST_INIT");
		},
	}
};
</script>

<style lang="scss">
.oa-application-mine-table{
	.vc-paging .__footer {
		width: 100% !important;
	}
}

</style>
