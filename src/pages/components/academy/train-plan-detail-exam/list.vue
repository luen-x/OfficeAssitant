<template>
	<div class="v-train-plan-detail-exam-list">
		<vc-paging
			ref="tableTarget"
			:columns="getColumns"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			mode="table"
			class="g-m-t-20 v-academy-train-plan-detail-exam-list"
			@page-size-change="handleChangePageSize"
			@selection-change="handleSelectionChange"
			@page-change="handlePageChange"
		>
			<div v-if="isNotice" slot="extra" class="g-flex-ac">
				<i-checkbox
					v-model="isAll"
					@on-change="handleIsAll"
				>
					全选
				</i-checkbox>
				<i-button 
					class="g-m-r-10"
					@click="handleNoticeAll"
				>
					批量提醒
				</i-button>
				<i-button 
					@click="handleDownload"
				>
					下载作业
				</i-button>
			</div>
		</vc-paging>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from "iview";
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import { downloadFile } from '@utils/download';
import checkAll from '@extends/mixins/checkAll';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyTrainPlanDetailExam.listInfo;
		},
		isNotice() {
			let listInfo = this.$store.state.academyTrainPlanDetailExam.listInfo;
			let start = listInfo.time[0];
			let end = listInfo.time[1];
			let notice = false;
			if (listInfo.enable_upload && start == '') {
				notice = true;
			} else if (listInfo.enable_upload && moment().isBefore(end) && moment(start).isBefore(new Date())) {
				notice = true;
			}
			return notice;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_INIT');
		},
		handlePageChange() {
			this.isAll = false;
			this.selected = [];
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleNoticeAll() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要提醒的人');
				return;
			}
			const staff_ids = this.selected.reduce((initVal, currentVal) => {
				currentVal.fileImage.length ? ''
					: initVal.push(currentVal.staff_id);
				return initVal;
			}, []);
			const staff_names = this.selected.reduce((initVal, currentVal) => {
				currentVal.fileImage.length ? ''
					: initVal.push(currentVal.staff_name);
				return initVal;
			}, []);
			if (!staff_ids.length) {
				this.$Message.warning('选中人已上传过作业');
				return;
			}
			this.handleNotice(staff_ids, staff_names);
		},
		handleDownload() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要下载的项');
				return;
			}
			let imageArr = this.selected.reduce((initVal, currentVal) => {
				currentVal.fileImage.forEach(v => {
					v.file_type == 1 ? initVal.push(v) : '';
				});
				return initVal;
			}, []);
			if (!imageArr.length) {
				this.$Message.warning('无下载项，请重新选择');
				return;
			}
			imageArr.forEach(it => {
				downloadFile({ fileName: it.img_url }).then((res) => {

				}).catch((err) => {

				});
			});
		},
	}
};

</script>

<style lang="scss">
.v-train-plan-detail-exam-list {
	.vc-paging .__footer {
		width: calc(100% - 340px) !important;
	}
}
</style>
