<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight, highlightRow: true}"
		mode="table"
		class="g-m-t-20 v-hr-academy-course-paper-add-list" 
		style="margin-bottom:10px"
		@row-click="handleOpenDrawer"
		@page-change="handlePageChangeMid"
		@page-size-change="handleChangePageSize"
		@selection-change="handleSelectionChangeMid"
	>
		<div slot="extra" class="g-flex-ac">
			<i-checkbox v-model="isAll" class="g-pd-l-10" @on-change="handleIsAll"><span>全选</span></i-checkbox>
			<i-button type="primary" class="g-m-r-10" @click="$emit('to-use')" >去使用</i-button>
			<i-button @click="handleRemoveAll">取消选择</i-button>
		</div>
	</vc-paging>
</template>

<script>
import { Paging } from 'wya-vc';
import { Checkbox, Button } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll, tableHeight({
		nav2: false, tab: false, extra: 305
	})],
	props: {
		value: {
			type: Array,
			default: () => []
		}

	},
	data() {
		const { query } = this.$route;

		return {
			selects: [...this.value],
			curPage: 0
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyCourseQuestion.listInfo;
		}
	},
	watch: {
		
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
				this.toggleSelect(res.data.list);
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		toggleSelect() {
			setTimeout(() => {
				let table = this.$refs.tableTarget.$refs.tableTarget;
				let isCheckAll = true;
				for (const data of table.rebuildData) {
				 const it = table.objData[data._index];
					const index = this.selects.findIndex(select => select.question_id == it.question_id);
					if (it._isChecked && index == -1) {
						it._isChecked = false;
					} else if (!it._isChecked && index > -1) {
						it._isChecked = true;
					}
					if (!it._isChecked) {
						isCheckAll = false;
					}
				}
				if (isCheckAll) {
					this.handleIsAll(true);
				}
				table = null;
			}, 10);
		},
		handleSelectionChangeMid(selection) {
			this.handleSelectionChange(selection);
			let { query = {} } = getParseUrl();
			let page = query.page || 1;
			const list = this.listInfo.data[page];
			const table = this.$refs.tableTarget.$refs.tableTarget;
			for (const data of table.rebuildData) {
				 const it = table.objData[data._index];
				const index = this.selects.findIndex(select => select.question_id == it.question_id);
				if (it._isChecked && index == -1) {
					this.selects.push(it);
				} else if (!it._isChecked && index > -1) {
					this.selects.splice(index, 1);
				}
			 }
			this.$emit('input', this.selects);
		},
		handlePageChangeMid(event) {
			this.curPage = event;
			this.handlePageChange(event);
			this.$nextTick(() => {
				this.toggleSelect();
			});
		},
		handleRemoveAll() {
			this.selects = [];
			this.handleIsAll(false);
			this.$emit('remove-all');
		}
	}
};

</script>

<style lang="scss">

</style>
