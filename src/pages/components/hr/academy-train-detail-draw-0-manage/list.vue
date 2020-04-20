<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		mode="table"
		class="g-m-t-20 v-hr-academy-train-detail-draw-0-manage-list"
		@page-size-change="handleChangePageSize"
		@page-change="handlePageChange"
		@selection-change="handleSelectionChange"
	>
		<div slot="extra" class="g-flex-ac">
			<i-checkbox
				v-model="isAll"
				@on-change="handleIsAll"
			>
				全选
			</i-checkbox>
			<i-button @click="handleAllDetel">批量删除</i-button>
		</div>
	</vc-paging>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import API_ROOT from '@stores/apis/root';
import { ModalTip } from '../academy-train-detail/_common/popup/model-tips';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-button': Button,
		'i-checkbox': Checkbox
	},
	mixins: [item, checkAll],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyTrainDetailDraw0Manage.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRAIN_DETAIL_DRAW_0_MANAGE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_0_MANAGE_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleAllDetel() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要批量删除的抽奖');
				return;
			}
			ModalTip.popup({
				title: '删除提示',
				content: "删除后不可恢复，是否确认删除？"
			}).then(res => {
				const lottery_ids = this.selected.reduce((initVal, currentVal) => {
					initVal.push(currentVal.lottery_id);
					return initVal;
				}, []);
				this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_DELETE_POST,
					param: { lottery_ids },
					type: 'POST'
				}).then(response => {
					this.$Message.success(response.msg);
					this.handleResetCur();
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(error => {
				error && console.error(error);
			});
		}
	}
};

</script>

<style lang="scss">
.v-hr-academy-train-detail-draw-0-manage-list {
	.__footer {
		width: calc(100% - 340px) !important;
	}
}
</style>
