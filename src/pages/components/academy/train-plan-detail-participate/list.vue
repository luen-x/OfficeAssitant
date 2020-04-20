<template>
	<div class="v-academy-train-plan-detail--participate-list">
		<div class="g-m-t-20">
			<span class="g-c-black4">课程名称：</span>
			<span class="g-m-r-30 g-c-black1">{{ listInfo.course_info.course_name }}</span>
			<span class="g-c-black4">授课地点：</span>
			<span class="g-m-r-30 g-c-black1">{{ listInfo.course_info.address || '--' }}</span>
			<span class="g-c-black4">授课时间：</span>
			<span class="g-m-r-30 g-c-black1">{{ listInfo.course_info.start_time }} 至 {{ listInfo.course_info.end_time }}</span>
			<span class="g-c-black4">授课讲师：</span>
			<span class="g-m-r-30 g-c-black1">{{ listInfo.course_info.lecture.map(res => res.staff_name).join(',') || '--' }}</span>
		</div>
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight}"
			mode="table"
			class="g-m-t-20 v-academy-train-plan-detail-participate-list"
			@page-size-change="handleChangePageSize"
			@selection-change="handleSelectionChange"
		>
			<div slot="extra" class="g-flex-ac">
				<i-checkbox
					v-model="isAll"
					@on-change="handleIsAll"
				>
					全选
				</i-checkbox>
				<i-button 
					@click="handleDeleteAll"
				>批量删除</i-button>
			</div>
		</vc-paging>
	</div>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import { Confirm } from "@common/confirm/confirm";
import item from './item';

export default {
	name: 'v-academy-train-plan-detail-participate-list',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll, tableHeight({ })],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyTrainPlanDetailParticipate.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_INIT');
		},
		handleDeleteAll() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要删除的项');
				return;
			}
			const participator_ids = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.participator_id);
				return initVal;
			}, []);
			this.handleDelete(participator_ids);
		},
		handleDelete(val) {
			Confirm.popup({
				title: "",
				msg: "删除后将无法恢复，确定要删除吗？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_DELETE_POST',
					type: "POST",
					param: {
						participator_ids: val
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
	}
};

</script>

<style lang="scss">
.v-academy-train-plan-detail--participate-list {
	.vc-paging .__footer {
		width: calc(100% - 340px) !important;
	}
}
</style>
