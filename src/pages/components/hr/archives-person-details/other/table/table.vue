<template>
	<div class="v-archives-person-details-table g-flex g-flex-cc">
		<div class="_table">
			<i-table :columns="columns" :data="tableData.list" class="g-m-b-20"/>
			<i-page 
				v-if="tableData.list&&tableData.list.length" 
				:total="tableData.totalPage*10" 
				class="_footpage" 
				@on-change="handlePage" />
		</div>
	</div>
	
</template>

<script>
import { Paging } from 'wya-vc';
import { Page, Table } from "iview";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
// item

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-table': Table,
		'i-page': Page,
	},
	data() {
		const { query } = this.$route;
		let columns = [
			{
				title: '评价人',
				key: 'staff_name',
				minWidth: 200,
			},
			{
				title: '部门',
				key: 'depart_name',
				minWidth: 200,
			},
			{
				title: '职位',
				key: 'position_name',
				minWidth: 200,
			},
			{
				title: '评价时间',
				key: 'create_time',
				minWidth: 200,
			},
			{
				title: '操作',
				key: 'at_percent',
				width: 150,
				render: (h, params) => {
					return (
						<div 
							class="g-operation" 
							onClick={() => this.handleCheck(params.row.recommend_info_id)}
						>查看</div>
					);
				}
			}
		];
		return {
			columns,
			tableData: []
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.$request({
				url: '_HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_RECOMMEND_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: 2,
					page,
					pageSize
				},
			}).then((res) => {
				this.tableData = res.data;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_RECOMMEND_LIST_INIT');
		},
		handlePage(val) {
			this.loadData(val);
		},
		handleCheck(recommend_info_id) {
			this.$router.push('/hr/archives/person/recommend?recommend_info_id=' + recommend_info_id);
		},
	}
};

</script>

<style lang="scss">
.v-archives-person-details-table{
	._table {
		width: 95%;
		padding-bottom: 20px;
		._footpage{
		margin-top: 10px;
		margin-bottom: 20px;
		float:right;
		}
	
	}
}

</style>
