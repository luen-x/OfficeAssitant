<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item, i) in tabs"
			:key="i"
			:label="item.label + tabsNum[i]" 
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="handleGetColumns(type)"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-hr-academy-train-detail-enroll-2-result-list"
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
import { Tabs, TabPane, Button, Checkbox } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { autoFix } from '@extends/mixins/auto-fix';
import { ModalTip } from '../academy-train-detail/_common/popup/model-tips';

// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		'i-checkbox': Checkbox
	},
	mixins: [item, checkAll, autoFix()],
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
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyTrainDetailEnroll2Result.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then(({ data }) => {
				this.tabsNum = [data.default_count, data.success_count, data.error_count];
				this.resetType('1', this.tabsNum, '/hr/academy/train/detail/enroll/2/result');
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
			this.$router.replace(getHashUrl('/hr/academy/train/detail/enroll/2/result', { ...query }));
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleBatchAudit() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要批量审核的项');
				return;
			}
			const recordIds = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.record_id);
				return initVal;
			}, []);
			this.handleAudit(recordIds);
		},
		handleGetColumns(type) {
			if (type == '1' && this.columns.length === 8) {
				this.columns.unshift({
					type: 'selection',
					width: 50,
					tooltip: true
				});
			} else if (type !== '1' && this.columns.length === 9) {
				this.columns.shift();
			}
			return this.columns;
		}
	}
};

</script>

<style lang="scss">
.v-hr-academy-train-detail-enroll-2-result-list {
	.__footer {
		width: calc(100% - 340px) !important;
	}
}
</style>
