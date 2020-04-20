<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + listInfo.count[index]"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="getColumns"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:table-opts="{height: tableHeight, highlightRow: true}"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-hr-archives-audit-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
				@row-click="handleOpenDrawer"
				@page-change="handlePageChange"
			>
				<div v-if="item.value == 2" slot="extra" class="g-flex-ac">
					<i-checkbox
						v-if="$auth[1672] || $auth[1673]"
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button v-if="$auth[1672]" @click="handleOptionAll(1)">举报通过</i-button>
					<i-button v-if="$auth[1673]" class="g-m-l-10" @click="handleOptionAll(0)">举报驳回</i-button>
				</div>
			</vc-paging>

		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from "iview";
import { Paging } from 'wya-vc';
import { tableHeight } from "@extends/mixins/tableHeight";
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { autoFix } from '@extends/mixins/auto-fix';

// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-checkbox": Checkbox,
		"i-button": Button
	},
	mixins: [
		item, 
		checkAll,
		tableHeight({
			extra: -50
			
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "2"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待审核', value: '2' }, 
				{ label: '已通过', value: '3' }, 
				{ label: '未通过', value: '4' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrArchivesAudit.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ARCHIVES_AUDIT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType("2", this.listInfo.count, "/hr/archives/audit");
			}).catch(console.error);
		},
		handleIsAll(val) {
			this.$refs.tableTarget[0].$refs.tableTarget.selectAll(val);
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/archives/audit', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_ARCHIVES_AUDIT_LIST_INIT');
		},
		handleOptionAll(name) {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要举报的项');
				return;
			}
			const report_ids = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.report_id);
				return initVal;
			}, []);
			const linkArr = this.selected.filter(v => v.record_type == 1 || v.record_type == 2);
			this.handleOption(report_ids, name, 5, '', linkArr.length);
		}
	}
};

</script>

<style lang="scss">

</style>
