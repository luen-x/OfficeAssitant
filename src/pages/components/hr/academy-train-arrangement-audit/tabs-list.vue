<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<div slot="extra" style="margin-top: 7px;">
			<span class="g-c-black4 g-pointer __select" @click="handleSelectTitle">选择表头</span>
		</div>

		<i-tab-pane 
			v-for="(item, i) in tabs"
			:key="i"
			:label="item.label + tabsNum[i]" 
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
				:table-opts="{tooltipTheme: 'light', height: tableHeight }"
				class="v-hr-academy-train-arrangement-audit-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div v-if="type == '1'" slot="extra" class="g-flex-ac">
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button @click="handleBatchAudit">批量审核</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import checkAll from '@extends/mixins/checkAll';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { TableTitle } from "@components/_common/table-title/table-title";
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';

// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll, tableHeight(), autoFix()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待审核', value: '1' }, 
				{ label: '已通过', value: '2' }, 
				{ label: '未通过', value: '3' }
			],
			tabsNum: [0, 0, 0],
			firstIn: true,
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyTrainArrangementAudit.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then(({ data }) => {
				this.tabsNum = [data.wait_count, data.pass_count, data.not_pass_count];
				this.resetType('1', this.tabsNum, '/hr/academy/train/arrangement/audit');
			}).catch((error) => {
				console.error(error);
			});
		},

		handleChange(type) {
			this.type = type;
			this.isAll = false;
			this.handleIsAll(false);

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/academy/train/arrangement/audit', { ...query }));
		},

		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_LIST_INIT');
		},

		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},

		handleBatchAudit() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要批量审核的项');
				return;
			}
			const courseIds = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.audit_id);
				return initVal;
			}, []);
			this.handleAudit(courseIds);
		},

		loadTableTitle(type) {
			return this.$request({
				url: "_HR_ACADEMY_COURSE_TABLE_TITLE_GET",
				type: "GET",
				param: {
					type: type || '1',
					table_type: 7
				},
				loading: false
			}).then(res => {
				this.$store.commit('HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state
				.hrAcademyTrainArrangementAudit.title[this.type];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_ACADEMY_COURSE_TABLE_TITLE_SAVE_POST',
				mutation: 'HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_TITLE_CHANGE',
				type: this.type,
				params: {
					table_type: 7
				}
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit('hr-academy-course-title-change', { type: this.type });
				this.$store.commit("HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_LIST_INIT", {
					type: this.type
				});
			}).catch(err => {
			});
		}
	}
};

</script>

<style lang="scss">

</style>
