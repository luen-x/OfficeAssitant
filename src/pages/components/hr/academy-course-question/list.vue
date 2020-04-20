<template>
	<div class="v-hr-academy-course-question-list"> 
		<div class="g-tr g-pd-lr-10 g-pd-t-10 g-pd-b-5" style="margin-bottom: -20px;"> 
			<span class="_split-bar"/>
			<span class="g-operation-hover" @click="handleChangeTableTitle">选择表头</span> 
		</div>
		<vc-paging
			ref="tableTarget"
			:columns="columnsShow"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight, highlightRow: true}"
			mode="table"
			class="g-m-t-20"
			@row-click="handleOpenDrawer"
			@page-change="handlePageChange"
			@page-size-change="handleChangePageSize"
			@selection-change="handleSelectionChange"
		>
			<div v-if="$auth[1060] || $auth[1061]" slot="extra" class="g-flex-ac">
				<i-checkbox v-model="isAll" @on-change="handleIsAll">全选</i-checkbox>
				<i-button v-if="$auth[1061]" class="g-m-l-5" @click="handleSetScore">设置分值</i-button>
				<i-button v-if="$auth[1060]" class="g-m-l-5" @click="handleDelete">删除</i-button>
			</div>
		</vc-paging>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Checkbox, Button } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { Confirm } from '@common/confirm/confirm';
import { TableTitle } from '@components/_common/table-title/table-title';
import { tableHeight } from '@extends/mixins/tableHeight';
import { SetScore } from '../_common/academy-course/modals/set-score';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll, tableHeight({ extra: 38, tab: false })],
	data() {
		const { query } = this.$route;

		return { 
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyCourseQuestion.listInfo;
		},
		columnsShow() {
			const columnsShow = this.$store.state.hrAcademyCourseQuestion.title.title_show.map(cloShow => {
				const result = this.columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result; 
			}).filter(Boolean);
			if (this.$auth[1060] || this.$auth[1061]) {
				columnsShow.splice(0, 0, {
					type: "selection",
					width: 60,
					fixed: "left",
					className: "g-pd-l-10"
				});
			}
			if (this.$auth[1057]) {
				columnsShow.push({
					title: '操作',
					key: '-',
					fixed: 'right',
					width: 100,
					render: (h, { row }) => {
						return (
							<div class="g-operation" onClick={() => this.handleEdit(row)}>
								编辑
							</div>
						);
					}
				});
			}
			return columnsShow;
		}
	},
	created() {
		this.loadTableTitle();

	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_COURSE_QUESTION_LIST_GET',
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
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleSetScore() {
			if (this.selected.length == 0) {
				this.$Message.error("请选择题目");
				return;
			}
			SetScore.popup({ questions: this.selected, type: 1 }).then(() => {
				this.handleResetCur();
			}).catch(() => {});
		},
		handleDelete(event, questionId) {
			if (!questionId && this.selected.length == 0) {
				this.$Message.error("请选择题目");
				return;
			}
			return Confirm.popup({ msg: '删除后将无法恢复，确定要删除吗？' }).then(() => {
				return this.$request({
					url: "_HR_TRAIN_LIBRARY_QUESTION_DELETE_POST",
					type: "POST",
					param: {
						type: 1,
						question_id: questionId ? [questionId] : this.selected.map(que => que.question_id)
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((res) => {
					this.$Message.error(res.msg);
					return Promise.reject();
				});
			});

		},
		handleChangeTableTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrAcademyCourseQuestion.title;
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_ACADEMY_COURSE_TABLE_TITLE_SAVE_POST',
				mutation: 'HR_ACADEMY_COURSE_QUESTION_TITLE_CHANGE',
				type: '1',
				params: {
					table_type: 3
				}

			}).then(() => {
				
			}).catch(() => {});

		},
		loadTableTitle() {
			this.$request({
				url: "_HR_ACADEMY_COURSE_TABLE_TITLE_GET",
				type: "GET",
				param: {
					table_type: 3
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_ACADEMY_COURSE_QUESTION_TITLE_CHANGE', { ...res.data, type: '1' });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
	}
};

</script>

<style lang="scss">
.v-hr-academy-course-question-list {
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
