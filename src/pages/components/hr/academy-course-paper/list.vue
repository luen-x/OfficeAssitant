<template>
	
	<div class="v-hr-academy-course-paper-list"> 
		<div class="g-tr g-pd-lr-10 g-pd-t-10 g-pd-b-5" style="margin-bottom: -20px;"> 
			<span class="_split-bar"/>
			<span class="g-operation-hover" @click="handleChangeTableTitle" >选择表头</span> 
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
			<div v-if="$auth[1072]" slot="extra" class="g-flex-ac">
				<i-checkbox v-model="isAll" @on-change="handleIsAll">全选</i-checkbox>
				<i-button v-if="$auth[1072]" @click="handleDelete">删除</i-button>
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

import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button,
	},
	mixins: [item, checkAll, tableHeight({ tab: false, extra: 38 })],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyCoursePaper.listInfo;
		},
		columnsShow() {
			const columnsShow = this.$store.state.hrAcademyCoursePaper.title.title_show.map(cloShow => {
				const result = this.columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result; 
			}).filter(Boolean);

			if (this.$auth[1072]) {
				columnsShow.splice(0, 0, {
					type: "selection",
					width: 60,
					fixed: "left",
					className: "g-pd-l-10"
				});
			}
			if (this.$auth[1068]) {
				columnsShow.push({
					title: '操作',
					key: '-',
					fixed: 'right',
					width: 100,
					render: (h, { row }) => {
						return (
							<div class="g-operation" onClick={() => this.handleEdit(row)} >编辑试卷</div>
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
				url: 'HR_ACADEMY_COURSE_PAPER_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				}
			}).then((res) => {
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_LIST_INIT');
		},
		handleDelete() {
			if (this.selected.length == 0) {
				this.$Message.error("请先选择试卷");
				return;
			}
			Confirm.popup({ msg: "删除后将不可恢复，确认删除吗？" }).then(() => {
				this.$request({
					url: "_HR_ACADEMY_COURSE_PAPER_DELETE_POST",
					type: "POST",
					param: {
						paper_ids: this.selected.map(i => i.paper_id)
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetFirst();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(() => {});
				
			
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleChangeTableTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrAcademyCoursePaper.title;
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_ACADEMY_COURSE_TABLE_TITLE_SAVE_POST',
				mutation: 'HR_ACADEMY_COURSE_PAPER_TITLE_CHANGE',
				type: '1',
				params: {
					table_type: 4
				}

			}).then(() => {
				
			}).catch(() => {});

		},
		loadTableTitle() {
			this.$request({
				url: "_HR_ACADEMY_COURSE_TABLE_TITLE_GET",
				type: "GET",
				param: {
					table_type: 4
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_ACADEMY_COURSE_PAPER_TITLE_CHANGE', { ...res.data, type: '1' });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
	}
};

</script>

<style lang="scss">
.v-hr-academy-course-paper-list {
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
