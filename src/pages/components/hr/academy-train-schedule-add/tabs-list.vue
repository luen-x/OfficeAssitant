<template>
	<div class="hr-academy-train-schedule-add-list">
		<i-tabs 
			:value="type" 
			:animated="false"
			type="card" 
			style="margin-top: 20px;"
			@on-click="handleChange"
		>
			<div slot="extra" class="g-tr g-pd-lr-10 g-pd-t-5 g-pd-b-5" style="margin-bottom: -15px;"> 
				<span class="_split-bar"/>
				<span class="g-operation-hover" @click="handleSelectTitle" >选择表头</span> 
			</div>
			<i-tab-pane 
				v-for="(item, index) in tabs"
				:key="item.value"
				:label="item.label + listInfo.count[index]"
				:name="item.value"
			>
				<vc-paging
					:ref="'talbe' + item.value"
					:columns="columns[item.value]"
					:show="item.value == type" 
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight, highlightRow: true}"
					class="v-hr-academy-train-schedule-add-list"
					mode="table"
					@page-size-change="handleChangePageSize"
					@page-change="handlePageChange"
					@selection-change="handleSelectionChange"
				>
					<div v-if="$auth[1128]" slot="extra" class="g-flex-ac">
						<i-checkbox
							v-if="type == '1' || type == '2'"
							v-model="isAll"
							@on-change="handleIsAll">
							全选
						</i-checkbox>
						<i-button v-if="type == '1'" @click="handleBatchAudit">批量审核</i-button>
						<div v-if="type == '2'" class="g-inline-block"> 
							<i-button v-if="$auth[956]" class="g-m-r-5" @click="handleChangeStatus(1)">设为必修</i-button>
							<i-button v-if="$auth[960]" class="g-m-r-5" @click="handleChangeStatus(2)">设为选修</i-button>
							<i-button v-if="$auth[961]" class="g-m-r-5" @click="handleChangeStatus(3)">设为内训</i-button>
						</div>
					</div>
				</vc-paging>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Button, Checkbox, Message } from 'iview';
import { Paging } from 'wya-vc';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import checkAll from '@extends/mixins/checkAll';
import API_ROOT from '@stores/apis/root';
import { TableTitle } from '../../_common/table-title/table-title';
import item from './item';
import { AuditModal } from './popup/modal-audit.vue';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		'i-checkbox': Checkbox,
	},
	mixins: [
		item,
		checkAll,
		tableHeight({ tab: false, extra: 100 }),
		autoFix()
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
			data: {},
			curPage: 1
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyTrainScheduleAdd.listInfo;
		},
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/hr/academy/train/schedule/add');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.isAll = false;
			this.type = type;
			this.handleIsAll(false);
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/academy/train/schedule/add', { ...query }));
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs['talbe' + this.type][0].$refs.tableTarget.selectAll(val);
		},
		handleBatchAudit() {
			if (!this.selected.length) {
				Message.warning('请先选择要审核的信息');
				return;
			}
			const recordIds = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.record_id);
				return initVal;
			}, []);
			AuditModal.popup({
				courseIds: recordIds,
			}).then(res => {
				this.$store.commit('HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_INIT');
			});
		},
		// 修改状态
		handleChangeStatus(status) {
			if (!this.selected.length) {
				Message.warning('请先选择要变更的信息');
				return;
			}
			const participatorIds = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.participator_id);
				return initVal;
			}, []);
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_SCHEDULE_CLASS_CHANGE_POST,
				param: { 
					study_type: status,
					participator_id: participatorIds
				},
				type: "POST"
			}).then(res => {
				Message.success('修改成功！');
				this.$store.commit('HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_INIT');
			}).catch(err => this.$Message.error(err.msg));
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_ACADEMY_COURSE_TABLE_TITLE_GET",
				type: "GET",
				param: {
					type: type || '1',
					table_type: 1
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_ACADEMY_TRAIN_SCHEDULE_ADD_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrAcademyTrainScheduleAdd.title[this.type];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_ACADEMY_COURSE_TABLE_TITLE_SAVE_POST',
				mutation: 'HR_ACADEMY_TRAIN_SCHEDULE_ADD_TITLE_CHANGE',
				type: this.type,
				params: {
					table_type: 1
				}
			}).then(() => {
				this.$vc.emit('hr-academy-train-schedule-add-title-change', { type: this.type });
				this.$store.commit("HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT", {
					type: this.type
				});
			}).catch(err => {
			});
		},
		handlePageChange(page) {
			this.curPage = page;
		},
	}
};

</script>

<style lang="scss" scope>
.hr-academy-train-schedule-add-list {
	._split-bar {
		position:relative;
		display:inline-block;
		margin: 0 10px;
		width:1px;
		height:12px;
		background:rgba(232,232,232,1);
		top:2px
	}
}
</style>
