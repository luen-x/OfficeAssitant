<template>
	<div class="g-m-l-10 g-m-t-20">
		<!-- <i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item, index) in tabs"
				:key="index"
				:label="item.label + listInfo.count[index]"
				:name="item.value"
			>
				<vc-paging
					ref="tableTarget"
					:columns="getColumns"
					:show="item.value == type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight, highlightRow: true}"
					class="v-hr-academy-train-detail-exam-0-audit-list"
					mode="table"
					@page-change="handlePageChange"
					@page-size-change="handleChangePageSize"
					@selection-change="handleSelectionChange"
				/>
			</i-tab-pane>
		</i-tabs> -->
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:show="true"
			:type="1"
			:data-source="listInfo[1].data"
			:total="listInfo[1].total"
			:reset="listInfo[1].reset"
			:current.sync="current[1]"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight}"
			class="v-sale-train-course-detail-tabs-list"
			mode="table"
			@page-change="handlePageChange"
			@page-size-change="handleChangePageSize"
			@selection-change="handleSelectionChange"
		/>
	</div>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { tableHeight } from '@extends/mixins/tableHeight';
import { Paging } from 'wya-vc';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import moment from "moment";
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
	mixins: [
		item,
		checkAll,
		autoFix(),
		tableHeight({ tab: false, extra: 38 })
	],
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
			firstIn: true
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleTrainCourseDetail.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_TRAIN_COURSE_DETAIL_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/sale/train/course/detail');
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
			this.$router.replace(getHashUrl('/sale/train/course/detail', { ...query }));
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('SALE_TRAIN_COURSE_DETAIL_LIST_INIT');
		},
		handleBatchAudit() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要批量审核的项');
				return;
			}
			const courseIds = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.course_id);
				return initVal;
			}, []);
			this.handleAudit(courseIds);
		}
	}
};

</script>

<style lang="scss">

</style>
