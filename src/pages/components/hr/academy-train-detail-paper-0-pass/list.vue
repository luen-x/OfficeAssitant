<template>
	<div class="academy-train-detail-paper-pass">
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			mode="table"
			class="g-m-t-20 v-hr-academy-train-detail-exam-0-pass-list"
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
				<i-button @click="handleAllDetel">删除</i-button>
			</div>
		</vc-paging>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import checkAll from '@extends/mixins/checkAll';
import API_ROOT from '@stores/apis/root';
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
			return this.$store.state.hrAcademyTrainDetailPaper0Pass.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_GET',
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
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleAllDetel() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要删除的试卷');
				return;
			}
			ModalTip.popup({
				title: '删除提示',
				content: "删除后不可恢复，是否确认删除？"
			}).then(res => {
				const exam_ids = this.selected.reduce((initVal, currentVal) => {
					initVal.push(currentVal.exam_id);
					return initVal;
				}, []);
				this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_PAPER_DELETE_POST,
					param: { exam_ids },
					type: 'POST'
				}).then(response => {
					this.$Message.success(response.msg);
					this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_INIT');
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(error => {
				console.error(error);
			});
		}
	}
};

</script>

<style lang="scss">
.academy-train-detail-paper-pass {
	.__footer {
		width: calc(100% - 340px) !important;
	}
}
</style>
