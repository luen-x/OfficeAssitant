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
				@selection-change="handleSelectionChange">

				<!-- <div slot="extra" class="g-flex-ac">
						<i-checkbox v-model="isAll" @on-change="handleIsAll">
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
						</i-button>
					</div> -->
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
		tableHeight(),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: (query.type || "1") + '', // 同tabs下的value
			current: {},
			tabs: [
				{ label: "待转正", value: "1" },
				{ label: "已转正", value: "2" },
				{ label: "转正未通过", value: "3" }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrEmployeeRelationTry.listInfo;
		},
	},
	mounted() {
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: "HR_EMPLOYEE_RELATION_TRY_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
				loading: false
			}).then(res => {
				this.resetType('1', this.listInfo.count, '/hr/employee/relation/try');
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
					type,
					fixPosition: false,
					page: this.current[type]
				};
				this.$router.replace(
					getHashUrl("/hr/employee/relation/try", { ...query })
				);
				this.$nextTick(() => {
					this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
				});
			}
		},
		handleChangePageSize() {
			this.$store.commit("HR_EMPLOYEE_RELATION_TRY_LIST_INIT");
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
