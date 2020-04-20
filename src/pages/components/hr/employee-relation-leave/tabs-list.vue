<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange">
		<i-tab-pane
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + listInfo.count[index]"
			:name="item.value">

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
				class="v-hr-employee-relation-leave-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange">

				<div slot="extra" class="g-flex-ac">
					<!-- <i-checkbox v-model="isAll" @on-change="handleIsAll">
						全选
					</i-checkbox>

					<i-button
						type="default"
						class="g-m-l-10"
						@click="handleDownload('apply')">
						申请单下载
					</i-button>
					<i-button
						type="default"
						class="g-m-l-10"
						@click="handleDownload('talk')">
						面谈单下载
					</i-button> -->
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import lodash from 'lodash';
import { Button, Checkbox, Tabs, TabPane } from "iview";
import { Paging } from "wya-vc";
import checkAll from '@extends/mixins/checkAll';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from "@utils/utils";
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import item from "./item";

export default {
	name: "oa-table",
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
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 0 }),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: "离职中", value: "1" },
				{ label: "已离职", value: "2" }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrEmployeeRelationLeave.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: "HR_EMPLOYEE_RELATION_LEAVE_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
				loading: false
			}).then(res => {
				this.resetType('1', this.listInfo.count, '/hr/employee/relation/leave');
			}).catch(error => {});
		},
		handleChange(type) {
			if (this.type !== type) {
				this.isAll = false;
				this.handleIsAll(false);
				this.type = type;

				// 根据tab改变设置filter的placeholder
				// this.$store.commit('HR_EMPLOYEE_RELATION_LEAVE_SET_MSG', type === '1' ? '请选择预计离职时间' : '请选择离职时间');

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					type,
					fixPosition: false,
					page: this.current[type]
				};
				this.$router.replace(
					getHashUrl("/hr/employee/relation/leave", { ...query })
				);
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit("HR_EMPLOYEE_RELATION_LEAVE_LIST_INIT");
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleDownload: lodash.debounce(function (name) {
			// if (name === 'apply') {
			// } else {
			// }
		}, 300),
	}
};
</script>

<style lang="scss">
</style>
