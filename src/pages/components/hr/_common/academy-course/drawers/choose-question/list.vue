<template>
	<!-- <div class="v-hr-academy-course-choose-question-list g-pd-b-30">  -->
	<div> 
		<vc-paging
			ref="tableTarget"
			:show="showList"
			:columns="columns"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="false"
			:load-data="loadData"
			:footer="!inLoading"
			:table-opts="{height: tableHeight, highlightRow: true}"
			mode="table"
			class="g-m-t-20 v-hr-academy-course-choose-question-list"
			@row-click="handleOpenDrawer"
			@page-change="handlePageChangeMid"
			@page-size-change="handleChangePageSize"
			@selection-change="handleSelectionChange"
		>
			<div slot="extra" class="g-flex-ac">
				<i-checkbox v-model="isAll" @on-change="handleIsAll">全选</i-checkbox>

				<i-button type="primary" class="g-m-l-10" @click="handleSave">
					去使用
				</i-button>
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
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll],
	props: {
		query: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		const { query } = this.$route;

		return {
			showList: false,
			inLoading: false,
			curPage: 0
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyCourseQuestionSelect.listInfo;
		},
		tableHeight() {
			let len = 0;
			let listInfoData = this.$store.state.hrAcademyCourseQuestionSelect.listInfo.data[this.curPage];

			for (let i in listInfoData) {
				listInfoData[i] && len++;
			}

			let winHeight;

			if (len > 15) {
				// 获取窗口高度
				if (window.innerHeight) {
					winHeight = window.innerHeight - 250;
				} else if (document.body && document.body.clientHeight) {
					winHeight = document.body.clientHeight - 250;
				}

				return winHeight;
			}
		}
	},
	mounted() {
		setTimeout(() => {
			this.showList = true;
		}, 100); 
	},
	destroyed() {
		this.handleResetFirst();
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			const query = { 
				...this.query, 
				subject_id: this.query.subject_ids[this.query.subject_ids.length - 1] || '' 
			};
			this.inLoading = true;
			return this.request({
				url: 'HR_ACADEMY_COURSE_QUESTION_SELECT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page: this.curPage ? page : 1,
					pageSize
				},
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			}).finally(() => {
				this.inLoading = false;
			});
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_SELECT_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handlePageChangeMid(page) {
			this.curPage = page;
			this.handlePageChange();
		},
		handleDelete(event, questionId) {
			return Confirm.popup({ msg: '删除后将无法恢复，确定要删除吗？' }).then(() => {
				return this.$request({
					url: "_HR_ACADEMY_COURSE_QUESTION_REMOVE_QUESTION_POST",
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
		handleSave() {
			this.$emit("save");
		}
	}
};
</script>

<style lang="scss">
// .v-hr-academy-course-choose-question-list {
// 	._split-bar {
// 		position:relative;
// 		display:inline-block;
// 		margin: 0 10px;
// 		width:1px;
// 		height:12px;
// 		background:rgba(232,232,232,1);
// 		top:2px
// 	}
// 	.vc-paging {
// 		.__footer {
// 			position: relative;
// 			width: auto !important ; 
// 			border: 1px solid lightgrey;		
// 			border-top: none;
// 			padding-left: 28px !important;
// 		}
// 	}
// }
.v-hr-academy-course-choose-question-list{
	.__footer{
		width: 940px !important;
	}
}
</style>
