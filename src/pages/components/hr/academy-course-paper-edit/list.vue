<template>
	<!-- 单张试卷的题目列表 -->
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: null, highlightRow: true}"
		mode="table"
		class="g-m-t-20 v-hr-academy-course-paper-edit-list"
		style="margin-bottom:10px"
		@row-click="handleOpenDrawer"
		@page-change="handlePageChangeMid"
		@page-size-change="handleChangePageSize"
		@selection-change="handleSelectionChange" 
	>
		<div slot="extra" class="g-flex-ac">
			<i-checkbox v-model="isAll" @on-change="handleIsAll">全选</i-checkbox>
			<i-button 
				v-if="paper_type == 1"
				type="primary" 
				class="g-m-l-5" 
				@click="handleSetScore">设置分值</i-button>
			<i-button class="g-m-l-10" @click="handleDelete">删除</i-button>
		</div>
	</vc-paging>
</template>


<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import checkAll from '@extends/mixins/checkAll';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import { SetScore } from '../_common/academy-course/modals/set-score';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-button': Button,
		'i-checkbox': Checkbox,
	},
	mixins: [item, checkAll],
	props: { 
		paperId: [Number, String],
		paper_type: [Number, String]
	},
	data() {
		const { query } = this.$route;

		return {
			curPage: 0,
		};
	},

	computed: {
		listInfo() {
			return this.$store.state.hrAcademyCoursePaperEdit.listInfo;
		},
		tableHeight() {
			if (this.listInfo.data[this.curPage] && this.listInfo.data[this.curPage].length > 9) {
				return 360;
			} else {
				return undefined;
			}
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_COURSE_PAPER_EDIT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_EDIT_LIST_INIT');
		},
		handlePageChangeMid(e) {
			this.curPage = e;
			this.handlePageChange(e);

		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleDelete(event, id) {
			if (!id && this.selected.length == 0) {
				this.$Message.error('请先选择题目');
				return Promise.reject();
			}
			return Confirm.popup({ msg: "删除后将无法恢复，确定要删除吗？" }).then(() => {
				this.$request({
					url: "_HR_ACADEMY_COURSE_PAPER_QUESTION_DELETE_POST",
					type: "POST",
					param: {
						type: 1,
						question_id: id ? [id] : this.selected.map(it => it.question_id),
						paper_id: this.$route.query.paper_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
					this.$emit('change');
				}).catch((res) => {
					this.$Message.error(res.msg);
					return Promise.reject();
				});
			});
		},

		handleSetScore() {
			if (this.selected.length == 0) {
				this.$Message.error("请先选择题目");
				return;
			}
			SetScore.popup({ questions: this.selected, type: 1, paperId: this.$route.query.paper_id }).then(() => {
				this.handleResetCur();
				this.$emit('change');
			}).catch(() => {});
		},
		
	}
};

</script>

<style lang="scss">
.v-hr-academy-course-paper-edit-list{
	&.v-hr-academy-course-paper-edit-list.vc-paging {
		.__footer {
			position: relative;
			width: auto !important ; 
			border: 1px solid lightgrey;		
			border-top: none;
			padding-left: 28px !important;
		}
	}
}

</style>
